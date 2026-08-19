import { loadCSS, loadHTML } from "../../utils/loader.js?v=6";

export class DashboardCards extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        try {
            const css = await loadCSS("component/dashboardcards/dashboardcards.css");
            const html = await loadHTML("component/dashboardcards/dashboardcards.html");
            this.shadowRoot.innerHTML = `
                <style>
                    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
                    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
                </style>
                <style>${css}</style>
                ${html}
            `;
            this.renderTasks();
        } catch (error) {
            console.error("Error loading dashboard cards component:", error);
        }
    }

    // Yeh method dashboard ko My Tasks ke saved records ke saath sync karta hai.
    renderTasks() {
        const tasks = JSON.parse(localStorage.getItem('project-manager-tasks') || '[]');
        const cards = this.shadowRoot.querySelector('#dashboardcards');
        if (!tasks.length) {
            cards.innerHTML = '<p class="dashboard-empty">Abhi koi task nahi hai. My Task se pehla task add karein.</p>';
            return;
        }
        cards.innerHTML = tasks.slice(0, 6).map((task) => `
            <article class="card ${task.completed ? 'completed' : ''}">
                <div class="card-priority"><p class="priority">${this.escape(task.priority)} Priority</p></div>
                <h2 class="task-heading">${this.escape(task.title)}</h2>
                <p class="task-description">${this.escape(task.description || 'No description')}</p>
                <div class="card-footer"><span>${task.completed ? 'Completed' : 'In progress'}</span>${task.dueDate ? `<time datetime="${task.dueDate}">${task.dueDate}</time>` : ''}</div>
                <progress value="${task.completed ? 100 : 40}" max="100" aria-label="${task.completed ? 'Completed' : 'In progress'}"></progress>
            </article>`).join('');
    }

    // Yeh method user text ko card HTML mein safe rakhta hai.
    escape(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
}

if (!customElements.get("c-dashboardcards")) {
    customElements.define("c-dashboardcards", DashboardCards);
}