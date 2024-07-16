// Function to convert Base64URL to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

// Hook for subscribing to push notifications
const useSubscribe = ({ publicKey }) => {
    const getSubscription = async () => {
        // Check for ServiceWorker and PushManager support
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw { errorCode: "ServiceWorkerAndPushManagerNotSupported" };
        }

        // Wait for Service Worker to be ready
        const registration = await navigator.serviceWorker.ready;

        // Check for pushManager in registration
        if (!registration.pushManager) {
            throw { errorCode: "PushManagerUnavailable" };
        }

        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            throw { errorCode: "ExistingSubscription" };
        }

        // Convert VAPID key for use in subscription
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        return await registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
        });
    };

    return {getSubscription};
};
