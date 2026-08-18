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
        } catch (error) {
            console.error('Error loading dashboard component:', error);
        }
    }
}

if (!customElements.get('c-dashboard')) {
    customElements.define('c-dashboard', Dashboard);
}