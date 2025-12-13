const CACHE_NAME = 'jump-math-v9';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './js/config.js',
    './js/audio.js',
    './js/entities/renderers/obstacle-renderers.js',
    './js/entities/renderers/decoration-renderers.js',
    './js/entities/player.js',
    './js/entities/coin.js',
    './js/entities/obstacle.js',
    './js/entities/platform.js',
    './js/entities/decoration.js',
    './js/engine.js',
    './js/ui.js',
    './js/main.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS);
            })
            .catch(err => {
                console.log('Error caching assets:', err);
            })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch new
                return response || fetch(event.request)
                    .then(fetchResponse => {
                        // Cache new resources
                        if (fetchResponse.ok) {
                            const responseClone = fetchResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return fetchResponse;
                    })
                    .catch(() => {
                        // Offline fallback
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});
