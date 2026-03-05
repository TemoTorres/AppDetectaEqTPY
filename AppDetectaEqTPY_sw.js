const CACHE_NAME = 'appdetectaeqtpy-v1';
const ASSETS = [
    './index.html',
    './AppDetectaEqTPY_dashboard.html',
    './AppDetectaEqTPY_manifest.json',
    './logo_tepeyac_75.jpg',
    './appdetectaeqtpy_icon_192.png',
    './appdetectaeqtpy_icon_512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
