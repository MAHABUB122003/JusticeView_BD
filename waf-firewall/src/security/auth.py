import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

class Auth:
    def __init__(self):
        self.admin_username = os.getenv('ADMIN_USERNAME', 'admin')
        self.admin_password_hash = self._hash_password(os.getenv('ADMIN_PASSWORD', 'admin123'))
        self._attempts = {}
        self.max_attempts = 5
        self.lockout_time = 300

    def _hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def verify_admin(self, username, password, ip='unknown'):
        if username != self.admin_username:
            return False
        import time
        if ip in self._attempts:
            attempts, lockout_time = self._attempts[ip]
            if attempts >= self.max_attempts and time.time() - lockout_time < self.lockout_time:
                return False
            if time.time() - lockout_time >= self.lockout_time:
                del self._attempts[ip]
        password_hash = self._hash_password(password)
        if password_hash == self.admin_password_hash:
            self._attempts.pop(ip, None)
            return True
        if ip not in self._attempts:
            self._attempts[ip] = [0, time.time()]
        self._attempts[ip][0] += 1
        self._attempts[ip][1] = time.time()
        return False

    def update_password(self, username, new_password):
        if username == self.admin_username:
            self.admin_password_hash = self._hash_password(new_password)
            return True
        return False
