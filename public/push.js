self.addEventListener('push', function(event) {
  console.log('Push message', event);
  var title = 'Push message';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: 'A message has arrived',
      icon: 'icons/icon-256x256.png',
      tag: 'Tag'
    }));
});
