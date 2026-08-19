import { loadCSS, loadHTML } from '../../utils/loader.js?v=6';

export class Dashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            const css = await loadCSS('screens/dashboard/dashboard.css');
            const html = await loadHTML('screens/dashboard/dashbaord.html');
            this.shadowRoot.innerHTML = `
            <style>
                @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
                @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
            </style>
            <style>${css}</style>
            ${html}
        `;

            this.renderTaskAnalytics();

            // Initialize chart after DOM is loaded
            this.initializeChart();
        } catch (error) {
            console.error('Error loading dashboard component:', error);
        }
    }

    // Yeh method local tasks se dashboard ke live completion numbers calculate karta hai.
    renderTaskAnalytics() {
        const tasks = JSON.parse(localStorage.getItem('project-manager-tasks') || '[]');
        const total = tasks.length;
        const completed = tasks.filter((task) => task.completed).length;
        const active = total - completed;
        const percentage = (value) => total ? Math.round((value / total) * 100) : 0;
        const completedPercent = this.shadowRoot.querySelector('#completed-percent');
        const activePercent = this.shadowRoot.querySelector('#active-percent');
        const backlogPercent = this.shadowRoot.querySelector('#backlog-percent');
        if (completedPercent) completedPercent.textContent = `${percentage(completed)}%`;
        if (activePercent) activePercent.textContent = `${percentage(active)}%`;
        if (backlogPercent) backlogPercent.textContent = `${total ? percentage(tasks.filter((task) => !task.dueDate).length) : 0}%`;
    }

    // Yeh method chart ko render karta hai aur offline CDN par readable fallback deta hai.
    initializeChart(attempt = 0) {
        // Wait for ApexCharts to be available
        if (typeof ApexCharts === 'undefined') {
            if (attempt < 20) {
                setTimeout(() => this.initializeChart(attempt + 1), 100);
            } else {
                const chartElement = this.shadowRoot.querySelector('#chart');
                if (chartElement) chartElement.innerHTML = '<div class="chart-fallback" role="img" aria-label="Average completion 74 percent"><strong>74%</strong><span>Average completion</span></div>';
            }
            return;
        }

        const chartElement = this.shadowRoot.querySelector('#chart');
        if (!chartElement) return;

        const options = {
            series: [68, 82, 54, 91],
            chart: {
                height: 140,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '8px',
                        },
                        value: {
                            fontSize: '6px',
                        },
                        total: {
                            show: true,
                            label: 'Average',
                            formatter: function (w) {
                                var total = w.globals.seriesTotals.reduce(function (a, b) {
                                    return a + b
                                }, 0)
                                return Math.round(total / w.globals.series.length) + '%'
                            },
                        },
                    },
                },
            },
            labels: ['North', 'South', 'East', 'West'],
        };

        const chart = new ApexCharts(chartElement, options);
        chart.render();
    }
}

if (!customElements.get('c-dashboard')) {
    customElements.define('c-dashboard', Dashboard);
}