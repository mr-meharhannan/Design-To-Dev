import { loadCSS, loadHTML } from "../../utils/loader.js";

export class Nav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        try {
            const css = await loadCSS("component/nav/nav.css");
            const html = await loadHTML("component/nav/nav.html");
            this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
        } catch (error) {
            console.error("Error loading nav component:", error);
        }
    }
}

if (!customElements.get("c-nav")) {
    customElements.define("c-nav", Nav);
}