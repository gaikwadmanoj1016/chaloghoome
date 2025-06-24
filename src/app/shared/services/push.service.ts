import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  readonly VAPID_PUBLIC_KEY = 'BJ6PutuZ-0n79VbgwfuDNGiau18JDLw_3-W_o6IUZBCVzzT49xae1dmswnR7yLzgakBg7JWSNw3DNuVg_NuyacQ';

  constructor(private swPush: SwPush, private http: HttpClient) { }
  private urlBase64ToUint8Array(base64String: string): any {
    console.log('[PushService] Converting VAPID key from Base64 to Uint8Array...');
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    try {
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      console.log('[PushService] Converted VAPID key successfully.');
      return outputArray;
    } catch (err) {
      console.error('[PushService] Failed to decode VAPID key:', err);
      throw err;
    }
  }

  subscribeToNotifications() {
    if (!this.swPush.isEnabled) {
      console.error('[PushService] Service Worker is not enabled in this browser!');
      return;
    }

    console.log('[PushService] Service Worker is enabled. Requesting subscription...');

    let convertedVapidKey: any;

    try {
      convertedVapidKey = this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY);
    } catch (err) {
      console.error('[PushService] Invalid VAPID key provided.');
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey: convertedVapidKey
    }).then(subscription => {
      console.log('[PushService] Subscription object received from browser:', subscription);

      const raw = subscription.toJSON();
      const endpoint = raw?.endpoint;
      const p256dh = raw?.keys?.['p256dh'];
      const auth = raw?.keys?.['auth'];

      if (!endpoint || !p256dh || !auth) {
        console.error('[PushService] Subscription object is missing required fields:', raw);
        return;
      }

      const pushSubscription = {
        endpoint,
        keys: { p256dh, auth }
      };

      console.log('[PushService] Sending subscription to backend:', pushSubscription);

      this.http.post('/api/notifications/send', pushSubscription).subscribe({
        next: () => console.log('✅ [PushService] Subscription sent to backend successfully.'),
        error: err => console.error('❌ [PushService] Error sending subscription to backend:', err)
      });

    }).catch(err => {
      console.error('❌ [PushService] Subscription failed:', err);
    });
  }
}