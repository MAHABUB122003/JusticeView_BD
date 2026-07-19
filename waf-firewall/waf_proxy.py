"""
WAF REVERSE PROXY - Universal Config-Driven
Connect to ANY website by editing config.json.
WAF analysis runs INSIDE the proxy - zero HTTP delay.
Static files: instant (no check). Dynamic requests: instant WAF check + route.
"""

from flask import Flask, request, Response, jsonify, send_from_directory
from flask_cors import CORS
import requests as http_client
import json
import time
import os
import sys
import logging

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.engine.rule_engine import RuleEngine
from src.engine.feature_extractor import FeatureExtractor
from src.engine.request_parser import RequestParser
from src.engine.ml_detector import MLDetector
from src.security.rate_limiter import RateLimiter
from src.security.ip_filter import IPFilter
from src.security.attack_blocker import AttackBlocker
from src.database.mongodb_connection import MongoDB

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')

def load_config():
    if not os.path.exists(CONFIG_PATH):
        print(f"[WAF] config.json not found at {CONFIG_PATH}")
        print("[WAF] Creating default config.json...")
        default = {
            "website_name": "MyWebsite",
            "backend_url": "http://localhost:8000",
            "proxy_port": 3000,
            "backend_timeout": 30,
            "whitelist_localhost": False,
            "frontend": {
                "mode": "static",
                "static_dir": "../frontend/dist",
                "spa": True
            },
            "backend_api": {
                "prefix": "api",
                "forward": True
            },
            "static_paths": ["uploads", "assets", "face-models"],
            "static_extensions": [".js", ".css", ".svg", ".png", ".jpg", ".jpeg",
                                  ".ico", ".gif", ".webp", ".woff", ".woff2",
                                  ".ttf", ".eot", ".map", ".otf"]
        }
        with open(CONFIG_PATH, 'w') as f:
            json.dump(default, f, indent=2)
        print(f"[WAF] Default config.json created. Edit it and restart.")
        return default

    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

cfg = load_config()

WEBSITE_NAME = cfg.get('website_name', 'MyWebsite')
BACKEND_URL = cfg.get('backend_url', 'http://localhost:8000')
PROXY_PORT = cfg.get('proxy_port', 3000)
BACKEND_TIMEOUT = cfg.get('backend_timeout', 30)
WHITELIST_LOCALHOST = cfg.get('whitelist_localhost', False)
STATIC_EXT = frozenset(cfg.get('static_extensions',
    ['.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.ico', '.gif', '.webp',
     '.woff', '.woff2', '.ttf', '.eot', '.map', '.otf']))
STATIC_PREFIXES = tuple(cfg.get('static_paths', ['uploads', 'assets']))
API_PREFIX = cfg.get('backend_api', {}).get('prefix', 'api')
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             cfg.get('frontend', {}).get('static_dir', '../frontend/dist'))
SPA_MODE = cfg.get('frontend', {}).get('spa', True)

logging.basicConfig(level=logging.INFO, format='%(asctime)s [WAF] %(message)s', datefmt='%H:%M:%S')
logger = logging.getLogger(__name__)

logger.info("Loading WAF engine...")
rule_engine = RuleEngine()
feature_extractor = FeatureExtractor()
request_parser = RequestParser()
ml_detector = MLDetector()
rate_limiter = RateLimiter()
ip_filter = IPFilter()
attack_blocker = AttackBlocker()
db = MongoDB()
logger.info("WAF engine loaded!")

def load_waf_settings():
    try:
        s = db.settings.find_one({'_type': 'waf_settings'})
        if not s:
            return {}
        return s
    except Exception:
        return {}

waf_settings = load_waf_settings()
rate_limiter.set_limit(waf_settings.get('rate_limit', 100))
learning_mode = waf_settings.get('learning_mode', False)
security_level = waf_settings.get('security_level', 'high')
confidence_threshold = waf_settings.get('confidence_threshold', 0.7)
log_retention_days = waf_settings.get('log_retention_days', 30)
auto_block_enabled = waf_settings.get('auto_block_enabled', True)
auto_block_threshold = waf_settings.get('auto_block_threshold', 20)
auto_block_window = waf_settings.get('auto_block_window_hours', 24)
auto_block_duration = waf_settings.get('auto_block_duration_hours', 24)
logger.info("Settings loaded: rate_limit=%s, security=%s, confidence=%.2f, learning=%s",
            rate_limiter.max_requests, security_level, confidence_threshold, learning_mode)
logger.info("Auto-block: enabled=%s, threshold=%s, window=%sh, duration=%sh",
            auto_block_enabled, auto_block_threshold, auto_block_window, auto_block_duration)

app = Flask(__name__)
CORS(app)

stats = {"total": 0, "blocked": 0, "allowed": 0, "static": 0, "errors": 0, "start": time.time()}

LOCAL_IPS = ['127.0.0.1', '::1', 'localhost']
if WHITELIST_LOCALHOST:
    for ip in LOCAL_IPS:
        ip_filter.add_to_whitelist(ip)
    logger.info("Localhost whitelist: ENABLED (development mode)")
else:
    logger.info("Localhost whitelist: DISABLED (production mode - ALL requests analyzed)")


def get_real_ip(incoming_request):
    forwarded_for = incoming_request.headers.get('X-Forwarded-For')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    real_ip = incoming_request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip.strip()
    return incoming_request.remote_addr or 'unknown'


def log_attack(incoming_request, result):
    from datetime import datetime
    ip = get_real_ip(incoming_request)
    url = incoming_request.full_path.rstrip('?')
    doc = {
        'ip': ip,
        'url': url,
        'method': incoming_request.method,
        'attack_type': result.get('attack_type') or 'Normal',
        'status': result.get('status', 'allowed'),
        'confidence': result.get('confidence', 0),
        'reference_id': result.get('reference_id', ''),
        'timestamp': datetime.now(),
        'user_agent': incoming_request.headers.get('User-Agent', ''),
        'referer': incoming_request.headers.get('Referer', ''),
        'rule_matched': result.get('rule_matched', ''),
        'details': {}
    }
    try:
        if result.get('status') == 'blocked':
            db.attacks.insert_one(doc.copy())
        db.requests.insert_one(doc.copy())
    except Exception as e:
        logger.warning("Failed to log to MongoDB: %s", e)


def analyze_local(incoming_request):
    global learning_mode, security_level, confidence_threshold
    ip = get_real_ip(incoming_request)
    url = incoming_request.full_path.rstrip('?')
    method = incoming_request.method

    if ip_filter.is_whitelisted(ip):
        return {'status': 'allowed', 'attack_type': None, 'confidence': 0.0}

    if learning_mode:
        return {'status': 'allowed', 'attack_type': None, 'confidence': 0.0, 'message': 'Learning mode - allowing all'}

    if rate_limiter.is_rate_limited(ip):
        attack_blocker.auto_block(ip, 'Rate limit exceeded', 1)
        return {'status': 'blocked', 'attack_type': 'Rate Limiting', 'confidence': 1.0,
                'reference_id': str(int(time.time() * 1000))[-8:]}

    if ip_filter.is_blacklisted(ip):
        return {'status': 'blocked', 'attack_type': 'Blacklisted IP', 'confidence': 1.0,
                'reference_id': str(int(time.time() * 1000))[-8:]}

    body = incoming_request.get_data(as_text=True)
    query_params = dict(incoming_request.args)

    request_data = {
        'url': url, 'method': method,
        'headers': dict(incoming_request.headers),
        'body': body, 'query_params': query_params, 'ip': ip
    }

    parsed = request_parser.parse(request_data)

    if body and method in ('POST', 'PUT', 'PATCH', 'DELETE'):
        logger.info("INPUT [%s %s] body_fields=%s", method, url,
                     list(parsed.get('body_fields', {}).keys())[:5] if parsed.get('body_fields') else 'raw')

    rule_matches = rule_engine.check_rules(parsed)
    if rule_matches:
        attack_type = rule_matches[0]['rule_name']
        logger.warning("RULE BLOCK: %s %s [%s]", method, url, attack_type)
        attack_blocker.record_attack(ip, attack_type, url)
        if auto_block_enabled:
            count = attack_blocker.get_attack_count(ip, auto_block_window)
            logger.info("Attack count for %s: %d/%d (threshold)", ip, count, auto_block_threshold)
            blocked = attack_blocker.check_and_auto_block(ip, auto_block_threshold, auto_block_window, auto_block_duration)
            if blocked:
                logger.warning("AUTO-BLOCKED: %s after %d attacks", ip, auto_block_threshold)
        else:
            logger.info("Auto-block is DISABLED, skipping auto-block for %s", ip)
        return {'status': 'blocked', 'attack_type': attack_type, 'confidence': 0.9,
                'reference_id': str(int(time.time() * 1000))[-8:],
                'rule_matched': attack_type,
                'message': f'Detected {attack_type} in request'}

    features = feature_extractor.extract_features(parsed)
    attack_keys = ['sql_score', 'xss_score', 'lfi_score', 'rce_score', 'ssti_score', 'ssrf_score']
    has_signal = any(features.get(k, 0) for k in attack_keys)

    if has_signal:
        ml_confidence = ml_detector.predict(features)
        if ml_confidence >= confidence_threshold:
            attack_type = ml_detector.get_attack_type(features) or 'Suspicious'
            attack_blocker.record_attack(ip, attack_type, url)
            if auto_block_enabled:
                count = attack_blocker.get_attack_count(ip, auto_block_window)
                logger.info("Attack count for %s: %d/%d (threshold)", ip, count, auto_block_threshold)
                blocked = attack_blocker.check_and_auto_block(ip, auto_block_threshold, auto_block_window, auto_block_duration)
                if blocked:
                    logger.warning("AUTO-BLOCKED: %s after %d attacks", ip, auto_block_threshold)
            return {'status': 'blocked', 'attack_type': attack_type, 'confidence': round(ml_confidence, 2),
                    'reference_id': str(int(time.time() * 1000))[-8:],
                    'message': f'ML model detected {attack_type} (confidence: {ml_confidence:.0%})'}

    if security_level == 'high' and has_signal:
        attack_type = feature_extractor.get_attack_type(features) or 'Suspicious'
        attack_blocker.record_attack(ip, attack_type, url)
        if auto_block_enabled:
            count = attack_blocker.get_attack_count(ip, auto_block_window)
            logger.info("Attack count for %s: %d/%d (threshold)", ip, count, auto_block_threshold)
            blocked = attack_blocker.check_and_auto_block(ip, auto_block_threshold, auto_block_window, auto_block_duration)
            if blocked:
                logger.warning("AUTO-BLOCKED: %s after %d attacks", ip, auto_block_threshold)
        return {'status': 'blocked', 'attack_type': attack_type, 'confidence': 0.75,
                'reference_id': str(int(time.time() * 1000))[-8:],
                'message': f'High security: Suspicious pattern detected'}

    rate_limiter.increment(ip)
    return {'status': 'allowed', 'attack_type': None, 'confidence': 0.0}


def forward_backend(req):
    url = f"{BACKEND_URL}{req.full_path}"
    headers = {}
    skip = {'host', 'connection', 'keep-alive', 'transfer-encoding', 'te', 'trailer',
            'upgrade', 'proxy-authorization', 'proxy-authenticate', 'content-encoding', 'content-length'}
    for k, v in req.headers:
        if k.lower() not in skip:
            headers[k] = v
    try:
        br = http_client.request(req.method, url, headers=headers, data=req.get_data(),
                                cookies=req.cookies, allow_redirects=False,
                                timeout=BACKEND_TIMEOUT, stream=True)
        exc = {'content-encoding', 'content-length', 'transfer-encoding', 'connection'}
        rh = [(n, v) for n, v in br.raw.headers.items() if n.lower() not in exc]
        return Response(br.content, status=br.status_code, headers=rh)
    except Exception:
        return Response(json.dumps({"error": "Backend unavailable"}), status=502, content_type="application/json")


def block_page(result):
    from datetime import datetime
    at = result.get("attack_type", "Unknown")
    rid = result.get("reference_id", "N/A")
    client_ip = get_real_ip(request)
    reason = result.get("message", "This request has been blocked by Web Application Firewall")
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied - WAF Firewall</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Inter', -apple-system, sans-serif; background: #f1f5f9; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }}
        .block-wrapper {{ width: 100%; max-width: 560px; animation: fadeIn .5s ease-out; }}
        @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(20px); }} to {{ opacity: 1; transform: translateY(0); }} }}
        .block-card {{ background: #fff; border-radius: 20px; padding: 36px 40px 28px; box-shadow: 0 20px 60px rgba(0,0,0,.05); border: 1px solid #e8edf4; }}
        .block-header {{ display: flex; align-items: center; justify-content: space-between; padding-bottom: 18px; border-bottom: 1px solid #f0f4fa; margin-bottom: 24px; }}
        .brand-text h2 {{ font-size: 18px; font-weight: 700; color: #0f172a; }}
        .brand-text span {{ font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; }}
        .ref-badge {{ font-size: 12px; color: #64748b; background: #f8fafc; padding: 4px 14px; border-radius: 16px; border: 1px solid #e8edf4; font-family: monospace; }}
        .block-content {{ text-align: center; }}
        .block-title {{ font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }}
        .block-subtitle {{ font-size: 15px; color: #64748b; margin-bottom: 24px; }}
        .details-grid {{ background: #f8fafc; border-radius: 12px; padding: 4px 18px; margin-bottom: 20px; border: 1px solid #e8edf4; text-align: left; }}
        .detail-row {{ display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid #f0f4fa; }}
        .detail-row:last-child {{ border-bottom: none; }}
        .detail-label {{ font-size: 12px; font-weight: 500; color: #64748b; text-transform: uppercase; letter-spacing: .4px; }}
        .detail-value {{ font-size: 13px; color: #0f172a; font-weight: 500; word-break: break-all; text-align: right; max-width: 55%; }}
        .detail-value.attack-type {{ color: #dc2626; font-weight: 600; }}
        .detail-value.reference {{ font-family: monospace; background: #fff; padding: 2px 10px; border-radius: 4px; border: 1px solid #e8edf4; font-size: 12px; }}
        .info-message {{ background: #f8fafc; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; border: 1px solid #e8edf4; text-align: left; font-size: 13px; color: #475569; line-height: 1.6; }}
        .block-actions {{ display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }}
        .btn {{ padding: 11px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; text-decoration: none; border: none; display: inline-block; }}
        .btn-primary {{ background: #667eea; color: #fff; }}
        .btn-primary:hover {{ transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,.3); }}
        .block-footer {{ text-align: center; padding-top: 18px; border-top: 1px solid #f0f4fa; font-size: 13px; color: #94a3b8; }}
        .block-footer strong {{ color: #64748b; }}
        @media (max-width: 600px) {{
            .block-card {{ padding: 24px 18px 20px; }}
            .block-title {{ font-size: 22px; }}
            .detail-row {{ flex-direction: column; align-items: flex-start; gap: 2px; }}
            .detail-value {{ text-align: left; max-width: 100%; }}
            .block-actions {{ flex-direction: column; }}
            .btn {{ width: 100%; text-align: center; }}
        }}
    </style>
</head>
<body>
    <div class="block-wrapper">
        <div class="block-card">
            <div class="block-header">
                <div class="brand-text">
                    <h2>SecureWAF</h2>
                    <span>{WEBSITE_NAME}</span>
                </div>
                <div class="ref-badge">ID: {rid}</div>
            </div>
            <div class="block-content">
                <h1 class="block-title">Access Denied</h1>
                <p class="block-subtitle">{reason}</p>
                <div class="details-grid">
                    <div class="detail-row">
                        <span class="detail-label">Attack Type</span>
                        <span class="detail-value attack-type">{at}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Your IP</span>
                        <span class="detail-value">{client_ip}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Reason</span>
                        <span class="detail-value">{reason}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Reference ID</span>
                        <span class="detail-value reference">{rid}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Timestamp</span>
                        <span class="detail-value">{timestamp}</span>
                    </div>
                </div>
                <div class="info-message">
                    If you believe this is a mistake, please contact the website administrator.
                    Provide the <strong>Reference ID</strong> for faster resolution.
                </div>
                <div class="block-actions">
                    <a href="/" class="btn btn-primary">Return to Homepage</a>
                </div>
            </div>
            <div class="block-footer">
                Protected by <strong>SecureWAF</strong> &mdash; All attacks are logged and monitored
            </div>
        </div>
    </div>
</body>
</html>"""
    return Response(html, status=403, content_type="text/html")


def serve_index():
    try:
        return send_from_directory(FRONTEND_DIR, 'index.html')
    except Exception:
        return Response(
            f"<h1>Frontend not found</h1>"
            f"<p>Set <code>frontend.static_dir</code> in config.json</p>"
            f"<p>Current: <code>{FRONTEND_DIR}</code></p>",
            status=404, content_type="text/html")


def serve_static(path):
    try:
        return send_from_directory(FRONTEND_DIR, path)
    except Exception:
        return Response("Not found", status=404)


@app.route('/_waf_reload', methods=['POST'])
def reload_settings():
    global waf_settings, learning_mode, security_level, confidence_threshold, log_retention_days
    global auto_block_enabled, auto_block_threshold, auto_block_window, auto_block_duration
    waf_settings = load_waf_settings()
    rate_limiter.set_limit(waf_settings.get('rate_limit', 100))
    learning_mode = waf_settings.get('learning_mode', False)
    security_level = waf_settings.get('security_level', 'high')
    confidence_threshold = waf_settings.get('confidence_threshold', 0.7)
    log_retention_days = waf_settings.get('log_retention_days', 30)
    auto_block_enabled = waf_settings.get('auto_block_enabled', True)
    auto_block_threshold = waf_settings.get('auto_block_threshold', 20)
    auto_block_window = waf_settings.get('auto_block_window_hours', 24)
    auto_block_duration = waf_settings.get('auto_block_duration_hours', 24)
    logger.info("Settings reloaded: rate_limit=%s, security=%s, confidence=%.2f, learning=%s, auto_block=%s",
                rate_limiter.max_requests, security_level, confidence_threshold, learning_mode, auto_block_enabled)
    return jsonify({'status': 'ok', 'message': 'Settings reloaded'})


@app.route('/_waf_cleanup', methods=['POST'])
def cleanup_logs():
    from datetime import datetime as dt, timedelta
    cutoff = dt.now() - timedelta(days=log_retention_days)
    try:
        a = db.attacks.delete_many({'timestamp': {'$lt': cutoff}}).deleted_count
        r = db.requests.delete_many({'timestamp': {'$lt': cutoff}}).deleted_count
        return jsonify({'status': 'ok', 'deleted_attacks': a, 'deleted_requests': r})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/', defaults={'path': ''}, methods=['GET','POST','PUT','DELETE','PATCH','OPTIONS','HEAD'])
@app.route('/<path:path>', methods=['GET','POST','PUT','DELETE','PATCH','OPTIONS','HEAD'])
def proxy(path):
    stats["total"] += 1

    if path == "_waf_status":
        up = int(time.time() - stats["start"])
        return jsonify({"proxy": "WAF Proxy", "website": WEBSITE_NAME, "backend": BACKEND_URL,
                        "config": {"proxy_port": PROXY_PORT, "api_prefix": API_PREFIX,
                                   "frontend_dir": FRONTEND_DIR, "spa_mode": SPA_MODE},
                        "stats": {"total": stats["total"], "blocked": stats["blocked"],
                        "allowed": stats["allowed"], "static": stats["static"],
                        "errors": stats["errors"], "uptime": up}})

    if path and any(path.startswith(p) for p in STATIC_PREFIXES):
        stats["static"] += 1
        return serve_static(path)
    if path and any(path.lower().endswith(e) for e in STATIC_EXT):
        stats["static"] += 1
        return serve_static(path)

    result = analyze_local(request)

    if result.get("status") == "blocked":
        stats["blocked"] += 1
        log_attack(request, result)
        logger.warning("BLOCKED: %s %s [%s]", request.method, path, result.get("attack_type"))
        return block_page(result)

    stats["allowed"] += 1
    log_attack(request, result)

    if path.startswith(f'{API_PREFIX}/'):
        return forward_backend(request)

    if SPA_MODE:
        return serve_index()

    return Response("Not found", status=404)


if __name__ == '__main__':
    fe = os.path.isdir(FRONTEND_DIR)
    print()
    print("=" * 60)
    print(f"  SecureWAF - Universal Web Application Firewall")
    print("=" * 60)
    print(f"  Website:    {WEBSITE_NAME}")
    print(f"  Visit:      http://localhost:{PROXY_PORT}")
    print(f"  Backend:    {BACKEND_URL}")
    print(f"  Frontend:   {FRONTEND_DIR} ({'OK' if fe else 'NOT FOUND'})")
    print(f"  API Prefix: /{API_PREFIX}")
    print(f"  Mode:       {'Development (localhost bypassed)' if WHITELIST_LOCALHOST else 'Production (ALL analyzed)'}")
    print(f"  Status:     http://localhost:{PROXY_PORT}/_waf_status")
    print("=" * 60)
    print()
    app.run(host='0.0.0.0', port=PROXY_PORT, debug=False, threaded=True)
