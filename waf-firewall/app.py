from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
from src.database.mongodb_connection import MongoDB
from src.api.waf_api import WAFAPI
from src.api.admin_api import AdminAPI
from src.security.auth import Auth
from src.security.ip_filter import IPFilter
from src.utils.logger import Logger
import os
import sys
import io
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def get_client_ip():
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr

def get_claimed_ip_from_headers(headers):
    if headers and headers.get('X-Forwarded-For'):
        return headers.get('X-Forwarded-For').split(',')[0].strip()
    return None

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key')
CORS(app)

db = MongoDB()
auth = Auth()
ip_filter = IPFilter()
waf_api = WAFAPI()
admin_api = AdminAPI()
logger = Logger()

# Load config to check whitelist_localhost setting
try:
    import json as _json
    _config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
    with open(_config_path, 'r') as _f:
        _cfg = _json.load(_f)
    WHITELIST_LOCALHOST = _cfg.get('whitelist_localhost', False)
except Exception:
    WHITELIST_LOCALHOST = False

# Only whitelist localhost if configured (for development)
LOCAL_IPS = ['127.0.0.1', '::1', 'localhost']
if WHITELIST_LOCALHOST:
    for ip in LOCAL_IPS:
        ip_filter.add_to_whitelist(ip)
        try:
            db.blacklist.delete_one({'ip': ip})
        except:
            pass
    print("[WAF] Localhost whitelisted (development mode)")
else:
    print("[WAF] Localhost NOT whitelisted (production mode - all requests analyzed)")

def show_startup_message():
    print("\n" + "="*40)
    print("\U0001f512 WAF Firewall Started Successfully")
    print("="*40)
    print(f"\U0001f4ca Admin Dashboard: http://localhost:5000/admin")
    print(f"\U0001f517 API Endpoint: http://localhost:5000/api")
    print(f"\U0001f4e1 Website Connection: http://localhost:5000/connect")
    print("\nDefault Admin Login:")
    print("Username: admin")
    print("Password: admin123")
    print("\n\u26a0\ufe0f  Please change password immediately!")
    print("="*40 + "\n")

@app.route('/')
def index():
    return redirect(url_for('admin_login'))

@app.route('/admin')
def admin_login():
    if 'user' in session:
        return redirect(url_for('admin_dashboard'))
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'user' not in session:
        return redirect(url_for('admin_login'))
    stats = admin_api.get_stats()
    return render_template('admin/dashboard.html', stats=stats, now=datetime.now())

@app.route('/admin/logs')
def admin_logs():
    if 'user' not in session:
        return redirect(url_for('admin_login'))
    page = request.args.get('page', 1, type=int)
    per_page = 50
    logs_data = admin_api.get_logs(request.args)
    return render_template('admin/logs.html', logs=logs_data, page=page, per_page=per_page, now=datetime.now())

@app.route('/admin/rules')
def admin_rules():
    if 'user' not in session:
        return redirect(url_for('admin_login'))
    rules = admin_api.get_rules()
    return render_template('admin/rules.html', rules=rules, now=datetime.now())

@app.route('/admin/clients')
def admin_clients():
    if 'user' not in session:
        return redirect(url_for('admin_login'))
    clients = admin_api.get_clients()
    return render_template('admin/clients.html', clients=clients, now=datetime.now())

@app.route('/admin/blacklist')
def admin_blacklist():
    if 'user' not in session:
        return redirect(url_for('admin_login'))
    blacklist = admin_api.get_blacklist()
    return render_template('admin/blacklist.html', blacklist=blacklist, now=datetime.now())

@app.route('/admin/settings')
def admin_settings():
    if 'user' not in session:
        return redirect(url_for('admin_login'))
    return render_template('admin/settings.html', now=datetime.now())

@app.route('/api/admin/login', methods=['POST'])
def admin_login_api():
    data = request.json
    client_ip = request.remote_addr or 'unknown'
    if auth.verify_admin(data.get('username'), data.get('password'), client_ip):
        session['user'] = data.get('username')
        return jsonify({'status': 'success', 'redirect': '/admin/dashboard'})
    return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('user', None)
    return jsonify({'status': 'success'})

@app.route('/api/admin/stats')
def admin_stats():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(admin_api.get_stats())

@app.route('/api/admin/logs', methods=['GET'])
def admin_get_logs():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(admin_api.get_logs(request.args))

@app.route('/api/admin/rules', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_manage_rules():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(admin_api.get_rules())
    elif request.method == 'POST':
        return jsonify(admin_api.create_rule(request.json))
    elif request.method == 'PUT':
        rule_id = request.args.get('id')
        return jsonify(admin_api.update_rule(rule_id, request.json))
    elif request.method == 'DELETE':
        rule_id = request.args.get('id')
        return jsonify(admin_api.delete_rule(rule_id))

@app.route('/api/admin/clients', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_manage_clients():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(admin_api.get_clients())
    elif request.method == 'POST':
        return jsonify(admin_api.add_client(request.json))
    elif request.method == 'PUT':
        client_id = request.args.get('id')
        return jsonify(admin_api.update_client(client_id, request.json))
    elif request.method == 'DELETE':
        client_id = request.args.get('id')
        return jsonify(admin_api.delete_client(client_id))

@app.route('/api/admin/blacklist', methods=['GET', 'POST', 'DELETE'])
def admin_manage_blacklist():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(admin_api.get_blacklist())
    elif request.method == 'POST':
        return jsonify(admin_api.add_to_blacklist(request.json))
    elif request.method == 'DELETE':
        ip = request.args.get('ip')
        return jsonify(admin_api.remove_from_blacklist(ip))

@app.route('/api/admin/settings', methods=['GET', 'POST'])
def admin_manage_settings():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(admin_api.get_settings())
    data = request.json
    return jsonify(admin_api.update_settings(data))

@app.route('/api/admin/change_password', methods=['POST'])
def admin_change_password():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    return jsonify(admin_api.change_password(data))

@app.route('/api/admin/clean_logs', methods=['POST'])
def admin_clean_logs():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json or {}
    days = data.get('days', 30)
    return jsonify(admin_api.clean_logs(days))

@app.route('/api/admin/clean_all_logs', methods=['POST'])
def admin_clean_all_logs():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(admin_api.clean_all_logs())

@app.route('/api/admin/reset_stats/<collection>', methods=['POST'])
def admin_reset_stats(collection):
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(admin_api.reset_stats(collection))

@app.route('/api/admin/clean_auto_blocks', methods=['POST'])
def admin_clean_auto_blocks():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(admin_api.clean_auto_blocks())

@app.route('/api/admin/clean_attack_attempts', methods=['POST'])
def admin_clean_attack_attempts():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json or {}
    days = data.get('days', 30)
    return jsonify(admin_api.clean_attack_attempts(days))

@app.route('/api/admin/auto_block_settings', methods=['GET', 'POST'])
def admin_auto_block_settings():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(admin_api.get_auto_block_settings())
    data = request.json
    return jsonify(admin_api.update_auto_block_settings(data))

@app.route('/api/admin/auto_block_stats', methods=['GET'])
def admin_auto_block_stats():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(admin_api.get_auto_block_stats())

@app.route('/api/connect', methods=['POST'])
def connect_website():
    api_key = request.headers.get('Authorization', '').replace('Bearer ', '')
    data = request.json
    if not api_key:
        return jsonify({'status': 'error', 'message': 'API key is required'}), 401
    client = waf_api.db.clients.find_one({'api_key': api_key, 'status': 'active'})
    if client:
        return jsonify({'status': 'success', 'client_id': str(client['_id']), 'api_key': api_key, 'message': 'Website already connected'})
    result = waf_api.connect_website(data)
    return jsonify(result)

@app.route('/api/analyze', methods=['POST'])
def analyze_request():
    api_key = request.headers.get('Authorization', '').replace('Bearer ', '')
    data = request.json
    if not waf_api.verify_api_key(api_key, data.get('domain')):
        return jsonify({'status': 'error', 'message': 'Invalid API key'}), 401
    result = waf_api.analyze_request(data.get('request', {}))
    if result['status'] == 'blocked':
        forwarded_headers = data['request'].get('headers', {})
        claimed_ip = get_claimed_ip_from_headers(forwarded_headers) or 'N/A'
        real_ip = data['request'].get('ip', get_client_ip())
        block_html = render_template('block_page.html',
            client_ip=claimed_ip,
            real_ip=real_ip,
            attack_type=result.get('attack_type', 'Unknown'),
            reason=f"Malicious payload detected (confidence: {result.get('confidence', 0):.2f})",
            reference_id=result.get('reference_id', 'N/A'),
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        return jsonify({
            'status': 'blocked',
            'block_page': block_html,
            'attack_type': result.get('attack_type')
        })
    return jsonify(result)

@app.route('/api/stats', methods=['GET'])
def get_api_stats():
    api_key = request.headers.get('Authorization', '').replace('Bearer ', '')
    domain = request.args.get('domain')
    if not waf_api.verify_api_key(api_key, domain):
        return jsonify({'error': 'Invalid API key'}), 401
    return jsonify(waf_api.get_stats(domain))

@app.route('/api/block', methods=['POST'])
def block_ip_api():
    api_key = request.headers.get('Authorization', '').replace('Bearer ', '')
    data = request.json
    if not waf_api.verify_api_key(api_key, data.get('domain')):
        return jsonify({'error': 'Invalid API key'}), 401
    result = waf_api.block_ip(data.get('ip'), data.get('reason'))
    return jsonify(result)

@app.route('/api/logs', methods=['GET'])
def api_get_logs():
    api_key = request.headers.get('Authorization', '').replace('Bearer ', '')
    domain = request.args.get('domain')
    if not waf_api.verify_api_key(api_key, domain):
        return jsonify({'error': 'Invalid API key'}), 401
    return jsonify(waf_api.get_logs(request.args))

@app.route('/connect')
def connect_page():
    return render_template('admin/connect.html', now=datetime.now())

@app.route('/blocked')
def block_page():
    """Render professional block page"""
    return render_template('block_page.html',
        client_ip=get_client_ip(),
        real_ip=request.remote_addr,
        attack_type="SQL Injection - Single Quote",
        reason="Malicious payload detected (confidence: 0.90)",
        reference_id="e2dc5614",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

if __name__ == '__main__':
    show_startup_message()
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
