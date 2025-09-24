// sw.js - Service Worker para funcionalidad offline

const CACHE_NAME = 'health-app-cache-v3'; // Versión actualizada del caché
const urlsToCache = [
  '/',
  '/index.html',
  '/suplementos.json',
  '/sintomas.json',
  '/examenes.json' // Agregado para cachear el archivo de exámenes
];

self.addEventListener('install', function(event) {
  // Realiza los pasos de instalación
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

