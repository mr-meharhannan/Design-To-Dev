import { loadCSS, loadHTML } from '../../utils/loader.js?v=6';

export class Schedule extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {

        const css = await loadCSS('screens/schedule/schedule.css');
        const html = await loadHTML('screens/schedule/schedule.html');
        this.shadowRoot.innerHTML = `
        <style>
                @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
                @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
            </style>
        <style>${css}</style>${html}`;
        this.tasks = JSON.parse(localStorage.getItem('project-manager-tasks') || '[]');
        this.calendar();
    }

    // Yeh method calendar controls aur back navigation ko connect karta hai.
    calendar() {
        const monthYearDisplay = this.shadowRoot.querySelector('#month-year-display');
        const daysGrid = this.shadowRoot.querySelector('#days-grid');
        const prevBtn = this.shadowRoot.querySelector('#prev-btn');
        const nextBtn = this.shadowRoot.querySelector('#next-btn');
        const backBtn = this.shadowRoot.querySelector('#back');
        const todayBtn = this.shadowRoot.querySelector('#today-btn');
        let currentDate = new Date();
        let selectedDate = new Date();

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        // Yeh helper date ko local storage ke liye consistent string banata hai.
        const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // Yeh method current month ke days aur selected state render karta hai.
        const renderCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            monthYearDisplay.textContent = `${months[month]} ${year}`;
            daysGrid.innerHTML = '';

            const firstDayIndex = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();
            const prevLastDate = new Date(year, month, 0).getDate();

            for (let i = firstDayIndex; i > 0; i -= 1) {
                const dayDiv = document.createElement('button');
                dayDiv.type = 'button';
                dayDiv.className = 'inactive-day';
                dayDiv.textContent = prevLastDate - i + 1;
                daysGrid.appendChild(dayDiv);
            }

            const today = new Date();
            for (let day = 1; day <= lastDate; day += 1) {
                const dayDiv = document.createElement('button');
                dayDiv.type = 'button';
                dayDiv.textContent = day;

                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayDiv.className = 'today';
                }

                if (dateKey(new Date(year, month, day)) === dateKey(selectedDate)) dayDiv.classList.add('selected-day');

                dayDiv.addEventListener('click', () => {
                    selectedDate = new Date(year, month, day);
                    renderCalendar();
                    renderSelectedTasks();
                });
                daysGrid.appendChild(dayDiv);
            }
        };

        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        backBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('navigate', { bubbles: true, composed: true, detail: { screen: 'dashboard' } }));
        });

        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            selectedDate = new Date();
            renderCalendar();
            renderSelectedTasks();
        });

        // Yeh method selected date ke due tasks ko list mein dikhata hai.
        const renderSelectedTasks = () => {
            const selectedKey = dateKey(selectedDate);
            const tasksForDay = this.tasks.filter((task) => task.dueDate === selectedKey);
            this.shadowRoot.querySelector('#selected-date').textContent = selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            this.shadowRoot.querySelector('#today-tasks').innerHTML = tasksForDay.length ? tasksForDay.map((task) => `<article class="scheduled-task"><strong>${this.escape(task.title)}</strong><span class="priority ${task.priority.toLowerCase()}">${task.priority} priority</span></article>`).join('') : '<p class="no-scheduled-tasks">No tasks planned for this day.</p>';
        };

        renderCalendar();
        renderSelectedTasks();
    }

    // Yeh method scheduled task title ko safe text mein convert karta hai.
    escape(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
}


if (!customElements.get('c-schedule')) customElements.define('c-schedule', Schedule);