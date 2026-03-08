const CACHE_NAME = 'appdetectaeqtpy-v14';
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
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Evitar cache para llamadas a la API de Supabase
    if (event.request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la red funciona, guardamos en caché y devolvemos
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, resClone);
                });
                return response;
            })
            .catch(() => {
                // Si falla la red, buscamos en el caché
                return caches.match(event.request);
            })
    );
});
