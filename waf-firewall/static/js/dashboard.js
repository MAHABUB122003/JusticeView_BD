document.addEventListener('DOMContentLoaded', function() {
    animateNumbers();
    loadStats();
    setupAutoRefresh();
});

function animateNumbers() {
    var cards = document.querySelectorAll('.stat-number');
    cards.forEach(function(el) {
        var target = parseInt(el.textContent.replace(/,/g, '')) || 0;
        if (target === 0) return;
        var duration = 800;
        var startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    });
}

function loadStats() {
    fetch('/api/admin/stats')
        .then(function(response) { return response.json(); })
        .then(function(stats) {
            updateStatCards(stats);
            updateRecentActivity(stats.recent_logs);
            updateCharts(stats);
        })
        .catch(function(error) {
            console.error('Error loading stats:', error);
        });
}

function updateStatCards(stats) {
    var ids = {
        statAttacks: stats.total_attacks_blocked || 0,
        statRequests: stats.total_requests || 0,
        statClients: stats.active_clients || 0,
        statBlacklist: stats.blacklisted_ips || 0
    };
    Object.keys(ids).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = ids[id].toLocaleString();
    });
}

function updateRecentActivity(logs) {
    var container = document.getElementById('activityTimeline');
    if (!container) return;
    if (!logs || logs.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:30px"><i class="fas fa-shield-check" style="font-size:32px;display:block;margin-bottom:8px"></i>No attacks recorded yet</div>';
        return;
    }
    container.innerHTML = logs.map(function(log) {
        var severity = 'medium';
        var at = (log.attack_type || '').toLowerCase();
        if (at.indexOf('sql') !== -1) severity = 'critical';
        else if (at.indexOf('xss') !== -1 || at.indexOf('lfi') !== -1) severity = 'high';
        return '<div class="activity-item">' +
            '<div class="activity-time">' + (log.timestamp || '') + '</div>' +
            '<div class="activity-content">' +
            '<span class="activity-type ' + severity + '"><i class="fas fa-bug"></i> ' + (log.attack_type || 'Unknown') + '</span>' +
            '<div class="activity-detail">From <strong>' + (log.ip || '') + '</strong></div>' +
            '<div class="activity-payload">' + (log.url || '') + '</div>' +
            '</div></div>';
    }).join('');
}

function updateCharts(stats) {
    if (window.attackChart) {
        window.attackChart.data.labels = stats.attack_types || [];
        window.attackChart.data.datasets[0].data = stats.attack_counts || [];
        window.attackChart.update();
    }
}

function setupAutoRefresh() {
    setInterval(loadStats, 30000);
}

function blockAttacker(ip) {
    fetch('/api/admin/blacklist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ip: ip, reason: 'Blocked from dashboard', type: 'permanent'})
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.status === 'success') {
            showToast('IP ' + ip + ' blocked successfully', 'success');
        } else {
            showToast(data.message || 'Failed to block IP', 'error');
        }
    })
    .catch(function() {
        showToast('Error blocking IP', 'error');
    });
}
