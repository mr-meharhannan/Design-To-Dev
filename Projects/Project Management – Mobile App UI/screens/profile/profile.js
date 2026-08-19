import { loadCSS, loadHTML } from '../../utils/loader.js?v=6';

export class Profile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const css = await loadCSS('screens/profile/profile.css');
        const html = await loadHTML('screens/profile/profile.html');
        this.shadowRoot.innerHTML = `<style>${css}</style><style>@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");</style>${html}`;
        this.profile = JSON.parse(localStorage.getItem('project-manager-profile') || '{"name":"Hannan","role":"Product Designer","email":"hannan@example.com"}');
        this.notificationsEnabled = localStorage.getItem('project-manager-notifications') !== 'off';
        this.darkMode = localStorage.getItem('project-manager-theme') === 'dark';
        this.bindEvents();
        this.renderProfile();
    }

    // Yeh method profile aur settings ke click actions connect karta hai.
    bindEvents() {
        const root = this.shadowRoot;
        root.querySelector('#edit-profile').addEventListener('click', () => this.openForm());
        root.querySelector('#close-profile-form').addEventListener('click', () => root.querySelector('#profile-dialog').close());
        root.querySelector('#profile-form').addEventListener('submit', (event) => this.saveProfile(event));
        root.querySelector('#notification-setting').addEventListener('click', () => { this.notificationsEnabled = !this.notificationsEnabled; localStorage.setItem('project-manager-notifications', this.notificationsEnabled ? 'on' : 'off'); this.renderProfile(); });
        root.querySelector('#theme-setting').addEventListener('click', () => { this.darkMode = !this.darkMode; localStorage.setItem('project-manager-theme', this.darkMode ? 'dark' : 'light'); this.renderProfile(); });
    }

    // Yeh method saved profile data ko screen par dikhata aur theme apply karta hai.
    renderProfile() {
        const root = this.shadowRoot;
        root.querySelector('#profile-name').textContent = this.profile.name;
        root.querySelector('#profile-role').textContent = this.profile.role;
        root.querySelector('#profile-email').textContent = this.profile.email;
        root.querySelector('#profile-avatar').textContent = this.profile.name.charAt(0).toUpperCase();
        root.querySelector('#notification-state').textContent = this.notificationsEnabled ? 'On' : 'Off';
        root.querySelector('#theme-state').textContent = this.darkMode ? 'Dark' : 'Light';
        root.querySelector('.screen').classList.toggle('dark-mode', this.darkMode);
    }

    // Yeh method edit dialog ko current profile values se fill karta hai.
    openForm() {
        const root = this.shadowRoot;
        root.querySelector('#profile-name-input').value = this.profile.name;
        root.querySelector('#profile-role-input').value = this.profile.role;
        root.querySelector('#profile-email-input').value = this.profile.email;
        root.querySelector('#profile-dialog').showModal();
    }

    // Yeh method valid profile form ko local storage mein persist karta hai.
    saveProfile(event) {
        event.preventDefault();
        const root = this.shadowRoot;
        this.profile = { name: root.querySelector('#profile-name-input').value.trim(), role: root.querySelector('#profile-role-input').value.trim(), email: root.querySelector('#profile-email-input').value.trim() };
        localStorage.setItem('project-manager-profile', JSON.stringify(this.profile));
        this.renderProfile(); root.querySelector('#profile-dialog').close();
    }
}

if (!customElements.get('c-profile')) customElements.define('c-profile', Profile);