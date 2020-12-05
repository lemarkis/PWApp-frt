import addNotification from 'react-push-notification';
import vapidConfig from './configs/vapid.config.json'
import api from './utils/api';

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
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

class swPush {
  public askNotificationPermission = async (): Promise<NotificationPermission> => {
    return await Notification.requestPermission();
  }

  public subscribeToNotifications = async (token: string): Promise<void> => {
    const perm = await this.askNotificationPermission();
    if (perm === 'granted') {
      navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidConfig.publicKey)
        }).then(function (subscription) {
          api.post('/api/push/subscribe', subscription, {
            headers: {'Authorization': `Bearer ${token}`},
          }).then((res) => {
            console.log(res);
            if (res !== null) {
              addNotification({
                title: 'Information',
                subtitle: 'Vous avez souscrit au notifications.',
                theme: 'darkblue',
              })
            }
          }).catch((e) => {
            addNotification({
              title: 'Information',
              subtitle: 'Une erreur est survenue, vous n\'avez pas donnée l\'autorisation.',
              theme: 'red',
            })
          })

        })
      })
    }
  }
}

export default new swPush();
