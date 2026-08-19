import { loadCSS, loadHTML } from "../../utils/loader.js?v=6";

export class Nav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        try {
            const css = await loadCSS("component/nav/nav.css");
            const html = await loadHTML("component/nav/nav.html");
            this.shadowRoot.innerHTML = `
                <style>
                    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
                    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
                </style>
                <style>${css}</style>
                ${html}
            `;

            this.shadowRoot.querySelectorAll('[data-screen]').forEach((item) => {
                item.addEventListener('click', () => {
                    this.dispatchEvent(new CustomEvent('navigate', {
                        bubbles: true,
                        composed: true,
                        detail: { screen: item.dataset.screen },
                    }));
                });
            });

            const activeScreen = this.getAttribute('screen');
            this.shadowRoot.querySelector(`[data-screen="${activeScreen}"]`)?.classList.add('active');

        } catch (error) {
            console.error("Error loading nav component:", error);
        }
    }
}

if (!customElements.get("c-nav")) {
    customElements.define("c-nav", Nav);
}