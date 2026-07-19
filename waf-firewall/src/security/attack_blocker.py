"""
Auto-Blocker: Tracks attack attempts per IP.
Auto-blocks IP after exceeding threshold within time window.
Supports temporary blocks with expiry.
"""

import logging
from datetime import datetime, timedelta
from src.database.mongodb_connection import MongoDB

logger = logging.getLogger(__name__)


class AttackBlocker:
    def __init__(self):
        self.db = MongoDB()

    def record_attack(self, ip, attack_type, url=''):
        doc = {
            'ip': ip,
            'attack_type': attack_type,
            'url': url,
            'timestamp': datetime.now(),
        }
        try:
            self.db.attack_attempts.insert_one(doc)
            logger.info("Recorded attack: %s [%s] from %s", url, attack_type, ip)
        except Exception as e:
            logger.error("Failed to record attack for %s: %s", ip, e)

    def get_attack_count(self, ip, hours=24):
        since = datetime.now() - timedelta(hours=hours)
        try:
            count = self.db.attack_attempts.count_documents({
                'ip': ip,
                'timestamp': {'$gte': since}
            })
            logger.debug("Attack count for %s in last %dh: %d", ip, hours, count)
            return count
        except Exception as e:
            logger.error("Failed to count attacks for %s: %s", ip, e)
            return 0

    def should_auto_block(self, ip, threshold=20, hours=24):
        count = self.get_attack_count(ip, hours)
        logger.info("Auto-block check: %s has %d attacks (threshold: %d)", ip, count, threshold)
        return count >= threshold, count

    def auto_block(self, ip, reason='Auto-blocked: exceeded attack threshold', duration_hours=24):
        try:
            existing = self.db.blacklist.find_one({'ip': ip})
            if existing:
                logger.info("IP %s already blacklisted, skipping", ip)
                return False

            is_permanent = duration_hours is None or duration_hours <= 0
            expires_at = None if is_permanent else datetime.now() + timedelta(hours=duration_hours)
            block_type = 'permanent' if is_permanent else 'temporary'

            self.db.blacklist.insert_one({
                'ip': ip,
                'reason': reason,
                'blocked_at': datetime.now(),
                'type': block_type,
                'expires_at': expires_at,
                'auto_blocked': True,
            })

            self.db.auto_blocks.insert_one({
                'ip': ip,
                'reason': reason,
                'blocked_at': datetime.now(),
                'expires_at': expires_at,
            })
            logger.warning("AUTO-BLOCKED IP: %s | reason: %s | type: %s | expires: %s",
                          ip, reason, block_type, expires_at or 'never')
            return True
        except Exception as e:
            logger.error("Failed to auto-block %s: %s", ip, e)
            return False

    def check_and_auto_block(self, ip, threshold=20, window_hours=24, duration_hours=24):
        if self.is_blacklisted(ip):
            logger.debug("IP %s already blacklisted, skipping auto-block check", ip)
            return False

        should_block, count = self.should_auto_block(ip, threshold, window_hours)
        if should_block:
            return self.auto_block(ip, f'Auto-blocked: {count} attacks in {window_hours}h', duration_hours)
        return False

    def is_blacklisted(self, ip):
        try:
            entry = self.db.blacklist.find_one({'ip': ip})
            if not entry:
                return False
            expires_at = entry.get('expires_at')
            if expires_at is not None and expires_at < datetime.now():
                self.db.blacklist.delete_one({'ip': ip})
                logger.info("Expired blacklist entry removed for %s", ip)
                return False
            return True
        except Exception as e:
            logger.error("Failed to check blacklist for %s: %s", ip, e)
            return False

    def cleanup_expired_blocks(self):
        now = datetime.now()
        try:
            result = self.db.blacklist.delete_many({
                'type': 'temporary',
                'expires_at': {'$lt': now}
            })
            if result.deleted_count > 0:
                logger.info("Cleaned up %d expired blacklist entries", result.deleted_count)
            return result.deleted_count
        except Exception as e:
            logger.error("Failed to cleanup expired blocks: %s", e)
            return 0

    def cleanup_old_attempts(self, days=30):
        cutoff = datetime.now() - timedelta(days=days)
        try:
            result = self.db.attack_attempts.delete_many({
                'timestamp': {'$lt': cutoff}
            })
            return result.deleted_count
        except Exception as e:
            logger.error("Failed to cleanup old attempts: %s", e)
            return 0

    def get_settings(self):
        settings = self.db.settings.find_one({'_type': 'waf_settings'})
        if settings:
            return {
                'auto_block_enabled': settings.get('auto_block_enabled', True),
                'auto_block_threshold': settings.get('auto_block_threshold', 20),
                'auto_block_window_hours': settings.get('auto_block_window_hours', 24),
                'auto_block_duration_hours': settings.get('auto_block_duration_hours', 24),
            }
        return {
            'auto_block_enabled': True,
            'auto_block_threshold': 20,
            'auto_block_window_hours': 24,
            'auto_block_duration_hours': 24,
        }
