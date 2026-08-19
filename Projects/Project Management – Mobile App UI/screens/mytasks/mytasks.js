import { loadCSS, loadHTML } from '../../utils/loader.js?v=6';

export class MyTasks extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const css = await loadCSS('screens/mytasks/mytasks.css');
        const html = await loadHTML('screens/mytasks/mytasks.html');
        this.shadowRoot.innerHTML = `<style>${css}</style><style>@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");</style>${html}`;
        this.tasks = this.readTasks();
        this.activeFilter = 'all';
        this.bindEvents();
        this.renderTasks();
    }

    // Yeh method browser mein saved tasks ko safe tareeqe se wapas laata hai.
    readTasks() {
        const savedTasks = localStorage.getItem('project-manager-tasks');
        if (savedTasks) return JSON.parse(savedTasks);
        return [
            { id: crypto.randomUUID(), title: 'Review project brief', description: 'Check requirements before the design handoff.', priority: 'High', dueDate: '', completed: false },
            { id: crypto.randomUUID(), title: 'Prepare weekly update', description: 'Share progress with the project team.', priority: 'Medium', dueDate: '', completed: true },
        ];
    }

    // Yeh method naye task data ko browser storage mein save karta hai.
    saveTasks() {
        localStorage.setItem('project-manager-tasks', JSON.stringify(this.tasks));
    }

    // Yeh method buttons, search aur form ke tamam interactions connect karta hai.
    bindEvents() {
        const root = this.shadowRoot;
        root.querySelector('#open-task-form').addEventListener('click', () => this.openForm());
        root.querySelector('#close-task-form').addEventListener('click', () => root.querySelector('#task-dialog').close());
        root.querySelector('#task-form').addEventListener('submit', (event) => this.submitForm(event));
        root.querySelector('#task-search').addEventListener('input', () => this.renderTasks());
        root.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
            this.activeFilter = button.dataset.filter;
            root.querySelectorAll('[data-filter]').forEach((tab) => tab.classList.toggle('active', tab === button));
            this.renderTasks();
        }));
    }

    // Yeh method selected filter aur search ke mutabiq task cards banata hai.
    renderTasks() {
        const root = this.shadowRoot;
        const search = root.querySelector('#task-search').value.toLowerCase().trim();
        const visibleTasks = this.tasks.filter((task) => {
            const filterMatch = this.activeFilter === 'all' || (this.activeFilter === 'completed' ? task.completed : !task.completed);
            return filterMatch && `${task.title} ${task.description}`.toLowerCase().includes(search);
        });
        root.querySelector('#task-list').innerHTML = visibleTasks.map((task) => `
            <article class="task-card ${task.completed ? 'completed' : ''}">
                <input class="task-check" type="checkbox" data-complete="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark ${this.escape(task.title)} complete">
                <div><h3>${this.escape(task.title)}</h3><p>${this.escape(task.description || 'No description')}</p><div class="task-meta"><span class="priority ${task.priority.toLowerCase()}">${task.priority} priority</span>${task.dueDate ? `<span><i class="fa-regular fa-calendar"></i> ${task.dueDate}</span>` : ''}</div></div>
                <div class="task-actions"><button type="button" data-edit="${task.id}" aria-label="Edit task" title="Edit task"><i class="fa-solid fa-pen"></i></button><button type="button" data-delete="${task.id}" aria-label="Delete task" title="Delete task"><i class="fa-solid fa-trash"></i></button></div>
            </article>`).join('');
        root.querySelector('#empty-state').hidden = visibleTasks.length > 0;
        root.querySelector('#task-count').textContent = `${this.tasks.length} task${this.tasks.length === 1 ? '' : 's'}`;
        root.querySelector('#task-progress').textContent = `${this.tasks.filter((task) => task.completed).length} completed`;
        root.querySelectorAll('[data-complete]').forEach((input) => input.addEventListener('change', () => this.toggleTask(input.dataset.complete)));
        root.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => this.openForm(button.dataset.edit)));
        root.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => this.deleteTask(button.dataset.delete)));
    }

    // Yeh method create aur edit dono ke liye form ko existing data se fill karta hai.
    openForm(taskId = '') {
        const root = this.shadowRoot;
        const task = this.tasks.find((item) => item.id === taskId);
        root.querySelector('#task-dialog-title').textContent = task ? 'Edit task' : 'Create task';
        root.querySelector('#task-id').value = task?.id || '';
        root.querySelector('#task-title').value = task?.title || '';
        root.querySelector('#task-description').value = task?.description || '';
        root.querySelector('#task-priority').value = task?.priority || 'Medium';
        root.querySelector('#task-due-date').value = task?.dueDate || '';
        root.querySelector('#task-dialog').showModal();
        root.querySelector('#task-title').focus();
    }

    // Yeh method form submit par task ko create ya update karta hai.
    submitForm(event) {
        event.preventDefault();
        const root = this.shadowRoot;
        const id = root.querySelector('#task-id').value || crypto.randomUUID();
        const taskData = { id, title: root.querySelector('#task-title').value.trim(), description: root.querySelector('#task-description').value.trim(), priority: root.querySelector('#task-priority').value, dueDate: root.querySelector('#task-due-date').value, completed: this.tasks.find((task) => task.id === id)?.completed || false };
        const existingIndex = this.tasks.findIndex((task) => task.id === id);
        if (existingIndex >= 0) this.tasks[existingIndex] = taskData; else this.tasks.unshift(taskData);
        this.saveTasks(); this.renderTasks(); root.querySelector('#task-dialog').close(); event.target.reset();
    }

    // Yeh method task ka complete status toggle karta hai.
    toggleTask(taskId) { const task = this.tasks.find((item) => item.id === taskId); if (task) task.completed = !task.completed; this.saveTasks(); this.renderTasks(); }

    // Yeh method user ke confirmation ke baad task delete karta hai.
    deleteTask(taskId) { if (!confirm('Delete this task?')) return; this.tasks = this.tasks.filter((task) => task.id !== taskId); this.saveTasks(); this.renderTasks(); }

    // Yeh method user ke text ko HTML injection se protect karta hai.
    escape(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
}

if (!customElements.get('c-mytasks')) customElements.define('c-mytasks', MyTasks);