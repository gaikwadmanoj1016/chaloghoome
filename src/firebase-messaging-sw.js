// firebase-messaging-sw.js
/* eslint-disable */
/* @ts-nocheck */

console.log('[firebase-messaging-sw.js] Loaded');

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCMNjzE84F-Hvk4YDj3IFCM9NEsu42Y2xU',
  authDomain: 'chaloghoome-b5833.firebaseapp.com',
  projectId: 'chaloghoome-b5833',
  storageBucket: 'chaloghoome-b5833.appspot.com', // ✅ corrected from .firebasestorage.app to .appspot.com
  messagingSenderId: '918553775992',
  appId: '1:918553775992:web:06bb6952353bce5589028d',
});

const messaging = firebase.messaging();

// Optional: Handle background messages via Firebase's own handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] onBackgroundMessage: ', payload);

  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body',
    icon: payload.notification?.icon || '/assets/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle push events not using FCM format
self.addEventListener('push', function(event) {
  try {
    const data = event.data?.json()?.notification || {};
    const title = data.title || 'Notification';
    const options = {
      body: data.body,
      icon: data.icon || '/assets/icon.png',
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Push Event Error:', err);
  }
});
