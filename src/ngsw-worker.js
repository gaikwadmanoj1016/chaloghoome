self.addEventListener('push', function(event) {
  const data = event.data?.text() || "New Notification!";
  const options = {
    body: data,
    icon: 'assets/icons/icon-72x72.png'
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
