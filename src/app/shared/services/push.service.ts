import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment.prod';
import { FirebaseApp } from '@angular/fire/app';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { FirebaseApp } from '@angular/fire/app';
// import { FirebaseApp } from 'firebase/app'; // ✅ CORRECT

@Injectable({
  providedIn: 'root'
})
export class PushService {

  // readonly VAPID_PUBLIC_KEY = 'BJ6PutuZ-0n79VbgwfuDNGiau18JDLw_3-W_o6IUZBCVzzT49xae1dmswnR7yLzgakBg7JWSNw3DNuVg_NuyacQ';

  // constructor(private swPush: SwPush, private http: HttpClient) { }

  // subscribeToNotifications() {
  //   if (!this.swPush.isEnabled) {
  //     console.error('[PushService] Service Worker is not enabled!');
  //     return;
  //   }

  //   console.log('[PushService] Requesting subscription...');

  //   this.swPush.requestSubscription({
  //     serverPublicKey: this.VAPID_PUBLIC_KEY  // ✅ MUST be string
  //   }).then(subscription => {
  //     console.log('[PushService] Subscription object:', subscription);

  //     const raw = subscription.toJSON();
  //     const endpoint = raw?.endpoint;
  //     const p256dh = raw?.keys?.['p256dh'];
  //     const auth = raw?.keys?.['auth'];

  //     if (!endpoint || !p256dh || !auth) {
  //       console.error('[PushService] Subscription missing fields:', raw);
  //       return;
  //     }

  //     const pushSubscription = {
  //       endpoint,
  //       keys: { p256dh, auth }
  //     };

  //     console.log('[PushService] Sending subscription to backend:', pushSubscription);

  //     this.http.post(environment.apiUrl + '/api/notifications/send', pushSubscription).subscribe({
  //       next: () => console.log('✅ Subscription sent to backend successfully.'),
  //       error: err => console.error('❌ Error sending subscription to backend:', err)
  //     });

  //   }).catch(err => {
  //     console.error('❌ Subscription failed:', err);
  //   });
  // }

  // requestPermission(): void {
  //   if ('Notification' in window) {
  //     Notification.requestPermission().then((permission) => {
  //       console.log('Permission:', permission);
  //     });
  //   }
  // }

  // showNotification(title: string, body: string): void {
  //   if (Notification.permission === 'granted') {
  //     new Notification(title, {
  //       body,
  //       icon: 'https://angular.io/assets/images/logos/angular/angular.png',
  //     });
  //   } else {
  //     console.warn('Notification permission not granted.');
  //   }
  // }
  private firebaseApp = inject(FirebaseApp); // waits for app initialization
  private messaging = getMessaging(this.firebaseApp);

  constructor() {
    this.listen();
  }

  private listen(): void {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        console.warn('[PushService] Notification permission not granted');
        return;
      }

      getToken(this.messaging, {
        vapidKey: environment.firebaseConfig.vapidKey
      }).then((token: any) => {
        if (token) {
          // console.log('[PushService] FCM Token:', token);
          // TODO: Send this token to your backend server
        } else {
          console.warn('[PushService] No token received');
        }
      });

      onMessage(this.messaging, (payload: any) => {
        console.log('[PushService] Message received in foreground:', payload);
        if (payload.notification?.title) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon || 'https://github.com/gaikwadmanoj1016/Assets/blob/main/001.jpg?raw=true',
          });
        }
      });
    });
  }
}