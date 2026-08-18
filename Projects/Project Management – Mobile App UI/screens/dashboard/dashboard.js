import { loadCSS, loadHTML } from '../../utils/loader.js';

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
            
            // Initialize chart after DOM is loaded
            this.initializeChart();
        } catch (error) {
            console.error('Error loading dashboard component:', error);
        }
    }

    initializeChart() {
        // Wait for ApexCharts to be available
        if (typeof ApexCharts === 'undefined') {
            setTimeout(() => this.initializeChart(), 100);
            return;
        }

        const chartElement = this.shadowRoot.querySelector('#chart');
        if (!chartElement) return;

        const options = {
            series: [68, 82, 54, 91],
            chart: {
                height: 200,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
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