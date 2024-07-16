self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.message,
        icon: 'imgs/logo_m.png',
        vibrate: [100, 50, 100],
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});