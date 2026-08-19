// All Components Loaded Here

import './component/nav/nav.js?v=6';
import './component/dashboardheader/c-dashboardheader.js?v=6';
import './component/dashboardcards/dashboardcards.js?v=6';

// All Screens Loaded Here

import './screens/dashboard/dashboard.js?v=6';
import './screens/mytasks/mytasks.js?v=6';
import './screens/schedule/schedule.js?v=6';
import './screens/profile/profile.js?v=6';

// Yeh service worker app ko offline launch aur cached files ka support deta hai.
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js?v=6').catch((error) => console.error('Service worker register nahi hua:', error));
}

// Yeh browser install prompt ko user ke liye clear install button mein convert karta hai.
let installPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
	event.preventDefault();
	installPrompt = event;
	const installButton = document.createElement('button');
	installButton.className = 'install-button';
	installButton.type = 'button';
	installButton.textContent = 'Install app';
	installButton.addEventListener('click', async () => {
		installPrompt.prompt();
		await installPrompt.userChoice;
		installPrompt = null;
		installButton.remove();
	});
	document.body.appendChild(installButton);
});

// Yeh event app ko browser history ke saath simple navigation state deta hai.
window.addEventListener('popstate', () => {
	const screen = new URLSearchParams(window.location.search).get('screen') || 'dashboard';
	navigateTo(screen, false);
});

const screens = {
	dashboard: 'c-dashboard',
	mytasks: 'c-mytasks',
	schedule: 'c-schedule',
	profile: 'c-profile',
};

// Yeh function selected screen ko mount karta aur URL state update karta hai.
function navigateTo(screen, updateHistory = true) {
	const screenTag = screens[screen];
	if (!screenTag || document.body.firstElementChild?.tagName.toLowerCase() === screenTag) return;
	if (updateHistory) history.pushState({ screen }, '', `?screen=${screen}`);
	document.body.replaceChildren(document.createElement(screenTag));
}

document.addEventListener('navigate', ({ detail }) => {
	navigateTo(detail?.screen);
});

// Yeh initial URL ko refresh ke baad bhi wahi screen maintain karne deta hai.
const initialScreen = new URLSearchParams(window.location.search).get('screen');
if (initialScreen && initialScreen !== 'dashboard') navigateTo(initialScreen, false);

