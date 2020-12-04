/// <reference lib="webworker" />

import addNotification from "react-push-notification";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: {request: Request, url: URL}) => {
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
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100 }),
    ],
  })
);

self.addEventListener('push', (push) => {
  // addNotification();
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if (clients.length){ // check if at least one tab is already open
      clients[0].focus();
    } else {
      self.clients.openWindow('/');
    }
  }));
});