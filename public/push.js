self.addEventListener('push', function(event) {
  console.log('Push message', event);
  var title = 'Showcase';
  event.waitUntil(
    // We could have added some code here to retrieve the unread messages from the server and display its contents
    self.registration.showNotification(title, {
      body: 'Someone sent you a message',
      icon: 'icons/icon-256x256.png',
      tag: 'Tag'
    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag ', event.notification.tag);
  event.notification.close();
  var url = 'https://mobile-web-experiments.afasnext.com';
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then(function(windowClients) {
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
