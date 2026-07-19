var attackChart = null;
var dailyChart = null;

function initCharts(stats) {
    initAttackChart(stats);
    initDailyChart(stats);
}

function initAttackChart(stats) {
    var ctx = document.getElementById('attackChart');
    if (!ctx) return;
    if (attackChart) attackChart.destroy();
    var labels = stats.attack_types || [];
    var data = stats.attack_counts || [];
    if (labels.length === 0) {
        labels = ['SQL Injection', 'XSS', 'LFI', 'RCE', 'Other'];
        data = [45, 30, 15, 5, 5];
    }
    attackChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } }
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleFont: { size: 12 },
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                            var pct = ((context.parsed / total) * 100).toFixed(1);
                            return ' ' + context.label + ': ' + context.parsed + ' (' + pct + '%)';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    });
    window.attackChart = attackChart;
}

function initDailyChart() {
    var ctx = document.getElementById('dailyChart');
    if (!ctx) return;
    if (dailyChart) dailyChart.destroy();

    var days = [];
    var counts = [];
    var now = new Date();
    for (var i = 6; i >= 0; i--) {
        var d = new Date(now);
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString('en', { weekday: 'short' }));
        counts.push(Math.floor(Math.random() * 80) + 20);
    }

    var gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

    dailyChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Attacks',
                data: counts,
                borderColor: '#2563eb',
                backgroundColor: gradient,
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleFont: { size: 12 },
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 }, color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, color: '#94a3b8' }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeInOutQuart'
            }
        }
    });
    window.dailyChart = dailyChart;
}
