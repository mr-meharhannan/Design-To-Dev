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
            this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        } catch (error) {
            console.error('Error loading dashboard component:', error);
        }
    }
}

if (!customElements.get('c-dashboard')) {
    customElements.define('c-dashboard', Dashboard);
}