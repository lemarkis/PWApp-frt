/// <reference lib="webworker" />

import addNotification from "react-push-notification";
import {clientsClaim} from "workbox-core";
import {ExpirationPlugin} from "workbox-expiration";
import {createHandlerBoundToURL, precacheAndRoute} from "workbox-precaching";
import {registerRoute} from "workbox-routing";
import {StaleWhileRevalidate} from "workbox-strategies";
import {PushNotification} from "react-push-notification/dist/notifications/Storage";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({request, url}: { request: Request, url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    return true;
  },
  createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`)
);

registerRoute(
  ({url}) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({maxEntries: 100}),
    ],
  })
);

self.addEventListener('push', push => {
  const notif = push?.data?.json().notification;
  addNotification({
    title: notif.title,
    vibrate: notif.vibrate,
    subtitle: 'Rappel',
    message: notif.body,
    theme: 'darkblue',
    native: true
  })
});

self.addEventListener('notificationclick', event => {
  if (event.action === 'close') {
    event.notification.close()
  } else {
    event.waitUntil(self.clients.matchAll().then(clients => {
      console.log(clients)
      self.clients.openWindow('/');
    }));
  }
});
