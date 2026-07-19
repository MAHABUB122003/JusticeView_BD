document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initClock();
    initUserDropdown();
    initNotificationPanel();
    initSidebarToggle();
});

function initSidebar() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function initClock() {
    var clock = document.getElementById('liveClock');
    if (!clock) return;
    function update() {
        var now = new Date();
        var y = now.getFullYear();
        var m = String(now.getMonth() + 1).padStart(2, '0');
        var d = String(now.getDate()).padStart(2, '0');
        var h = String(now.getHours()).padStart(2, '0');
        var min = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
    }
    update();
    setInterval(update, 1000);
}

function initUserDropdown() {
    var trigger = document.getElementById('userDropdown');
    var menu = document.getElementById('dropdownMenu');
    if (!trigger || !menu) return;
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('show');
        var panel = document.getElementById('notificationPanel');
        if (panel) panel.classList.remove('show');
    });
    document.addEventListener('click', function() {
        menu.classList.remove('show');
    });
}

function initNotificationPanel() {
    var btn = document.getElementById('notificationBtn');
    var panel = document.getElementById('notificationPanel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        panel.classList.toggle('show');
        var menu = document.getElementById('dropdownMenu');
        if (menu) menu.classList.remove('show');
    });
    document.addEventListener('click', function() {
        panel.classList.remove('show');
    });
}

function initSidebarToggle() {
    var btn = document.getElementById('menuToggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (!btn || !sidebar || !overlay) return;
    btn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

function showToast(message, type) {
    type = type || 'success';
    var existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'notification-toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.classList.add('hiding');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3500);
}

function formatDate(date) {
    var d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard!', 'success');
    }).catch(function() {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast('Copied to clipboard!', 'success');
    });
}

function logout() {
    fetch('/api/admin/logout', {method: 'POST'})
        .then(function() { window.location.href = '/admin'; });
}
