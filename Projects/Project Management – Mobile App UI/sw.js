const CACHE_NAME = 'project-manager-v6';
const APP_SHELL = [
    './',
    './index.html',
    './style.css?v=4',
    './script.js?v=6',
    './manifest.webmanifest',
    './offline.html',
    './utils/loader.js',
    './component/nav/nav.js',
    './component/nav/nav.html',
    './component/nav/nav.css?v=20260819',
    './component/dashboardheader/c-dashboardheader.js',
    './component/dashboardheader/c-dashboardheader.html',
    './component/dashboardheader/c-dashboardheader.css',
    './component/dashboardcards/dashboardcards.js',
    './component/dashboardcards/dashboardcards.html',
    './component/dashboardcards/dashboardcards.css',
    './screens/dashboard/dashboard.js',
    './screens/dashboard/dashbaord.html',
    './screens/dashboard/dashboard.css',
    './screens/mytasks/mytasks.js',
    './screens/mytasks/mytasks.html',
    './screens/mytasks/mytasks.css',
    './screens/schedule/schedule.js',
    './screens/schedule/schedule.html',
    './screens/schedule/schedule.css',
    './screens/profile/profile.js',
    './screens/profile/profile.html',
    './screens/profile/profile.css',
];

// Yeh install event app ki local shell ko pehle se cache karta hai.
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

// Yeh activate event purane cache versions ko remove karta hai.
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

// Yeh fetch strategy pehle fresh file mangti hai aur network fail par cached copy deti hai.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
    }).catch(() => caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || caches.match('./offline.html'))));
});