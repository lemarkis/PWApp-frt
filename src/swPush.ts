import addNotification from 'react-push-notification';
import { IReminders, ITask } from './models/task.model';

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

// const subscription = await registration.pushManager.subscribe({
//   userVisibleOnly: true,
//   applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
// });

export class swPush {
  public askNotificationPermission = async (): Promise<NotificationPermission> => {
    return await Notification.requestPermission();
  }

  // TODO implémenter la subscription
  // subscribeToNotifications() {
  //   this.swPush.requestSubscription({
  //       serverPublicKey: this.VAPID_PUBLIC_KEY
  //   })
  //   .then(sub => this.ns.addPushSubscriber(sub).subscribe( res => {
  //     console.log(res);
  //   }))
  //   .catch(err => console.error("Could not subscribe to notifications", err));
  // }
}
