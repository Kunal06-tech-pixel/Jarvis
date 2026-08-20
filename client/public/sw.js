// =============================================
// JARVIS Service Worker — Web Push Notifications
// =============================================

self.addEventListener('install', (event) => {
  console.log('[SW] JARVIS Service Worker installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] JARVIS Service Worker activated.');
  event.waitUntil(self.clients.claim());
});

/**
 * Handle incoming Web Push notification payloads from JARVIS server
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received:', event);

  let data = {
    title: 'JARVIS Reminder',
    body: 'You have a scheduled reminder.',
    url: '/reminders',
    tag: 'jarvis-reminder',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'jarvis-reminder',
    renotify: true,
    requireInteraction: true, // Remains on screen until user interacts
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/reminders',
      ...data.data,
    },
    actions: [
      { action: 'open', title: 'Open JARVIS' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

/**
 * Handle user interaction with the notification banner
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag, event.action);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/reminders';
  const fullTargetUrl = new URL(targetUrl, self.location.origin).href;

  // Focus existing open tab or open a new one
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === fullTargetUrl || client.url.includes(self.location.origin)) {
          if ('focus' in client) {
            client.focus();
            if (client.navigate && client.url !== fullTargetUrl) {
              return client.navigate(fullTargetUrl);
            }
            return client;
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(fullTargetUrl);
      }
    })
  );
});
