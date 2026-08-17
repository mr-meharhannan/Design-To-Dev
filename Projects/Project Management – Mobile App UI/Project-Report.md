# Project Progress Report

## 1. Project Name
Project Management Mobile App UI

## 2. Objective
The goal of this project was to create a clean mobile app style dashboard and navigation interface for a project management application. The project includes a reusable navigation component and a dashboard screen that renders inside a custom web component structure.

## 3. What I Completed

### A. Created a navigation component
I created a reusable nav component that loads HTML and CSS dynamically and renders inside a shadow DOM.

### B. Created a dashboard screen
I created a dashboard screen component that loads its own CSS and HTML and attaches it to the page.

### C. Connected components through script imports
I loaded the required components from the main script file so the browser can initialize the custom elements correctly.

### D. Fixed module and path issues
I fixed the broken import paths and wrong file references that were preventing the UI from appearing in the browser.

### E. Verified rendering in browser
I tested the page in the browser and confirmed that the dashboard and nav render successfully.

---

## 4. Major Issues Faced and Fixes

### Issue 1: Nav was not visible
The initial problem was that the component tag name and import path were incorrect. The browser was not loading the component because the script path and custom element name did not match.

### Fix
I corrected the custom element registration and ensured the module imports used valid browser paths.

```js
if (!customElements.get('c-nav')) {
    customElements.define('c-nav', Nav);
}
```

### Issue 2: Dashboard was not rendering
The dashboard component imported the wrong loader file and used synchronous loading even though CSS and HTML were being fetched asynchronously.

### Fix
I replaced the incorrect import and used async loading properly.

```js
import { loadCSS, loadHTML } from '../../utils/loder.js';

async connectedCallback() {
    try {
        const css = await loadCSS('screens/dashboard/dashboard.css');
        const html = await loadHTML('screens/dashboard/dashbaord.html');
        this.shadowRoot.innerHTML = `<style>${css}</style>${html>`;
    } catch (error) {
        console.error('Error loading dashboard component:', error);
    }
}
```

### Issue 3: Browser did not recognize bare module paths
The code originally used bare paths such as `component/nav/nav.js`, which browsers do not resolve correctly in a plain static project.

### Fix
I changed the entry point so the browser loads the module through a valid relative path.

```html
<script type="module" src="./script.js"></script>
```

```js
import './component/nav/nav.js';
import './screens/dashboard/dashboard.js';
```

---

## 5. Key Project Files

### Main page
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <c-dashboard></c-dashboard>
    <script type="module" src="./script.js"></script>
</body>
</html>
```

### Main script entry file
```js
// All Components Loaded Here
import './component/nav/nav.js';

// All Screens Loaded Here
import './screens/dashboard/dashboard.js';
```

### Nav component
```js
import { loadCSS, loadHTML } from "../../utils/loder.js";

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
```

### Dashboard component
```js
import { loadCSS, loadHTML } from '../../utils/loder.js';

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
```

### Dashboard HTML
```html
<div id="dashboard">
    <c-nav></c-nav>
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>
</div>
```

---

## 6. Verification Result
I verified the page in the browser after fixing the issues. The test result showed:

- Dashboard element exists: true
- Nav count inside dashboard: 1
- Shadow HTML of the dashboard contains the nav and dashboard content

This proves the structure is loading successfully.

---

## 7. Conclusion
The project has progressed from a broken static page into a working component-based UI structure. The navigation and dashboard are now successfully connected and rendered in the browser. This provides a strong foundation for future features like task pages, project cards, filters, and charts.

---

## 8. Final Note
This project is now in a functional state and ready for further UI enhancement and additional screens. The code is structured in a reusable and modular way, which makes it easier to extend in the future.
