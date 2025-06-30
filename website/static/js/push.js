navigator.serviceWorker.register('/static/js/sw.js')
  .then((registration) => {
    console.log('Service Worker registered:', registration);
    
    // Get push subscription
    return registration.pushManager.getSubscription()
      .then(async (subscription) => {
        if (subscription) return subscription;

        const vapidPublicKey = 'BFS8juFzoGmrBnewXFIsYGy0MjBRiuRJ1Oz-5zrBWS_Gn7RVEmjQ1yPIBV2AdAINn6_2DHhFp6QKsQvcjjDPO0c';
        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });
      });
  })
  .then((subscription) => {
    fetch('/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  });

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
