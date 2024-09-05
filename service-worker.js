self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

// self.addEventListener('fetch', (event) => {
//   console.log('Service Worker: Fetch event', event.request.url);
  
//   event.respondWith(
//     fetch(event.request).then(response => {
//       console.log('Service Worker: Fetch response', response);
//       return response;
//     }).catch(error => {
//       console.error('Service Worker: Fetch failed', error);
//       throw error;
//     })
//   );
// });
