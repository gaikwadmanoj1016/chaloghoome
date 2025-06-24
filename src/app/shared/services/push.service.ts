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
  
  subscribeToNotifications() {
    if (!this.swPush.isEnabled) {
      console.error('[PushService] Service Worker is not enabled!');
      return;
    }

    console.log('[PushService] Requesting subscription...');

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY  // ✅ MUST be string
    }).then(subscription => {
      console.log('[PushService] Subscription object:', subscription);

      const raw = subscription.toJSON();
      const endpoint = raw?.endpoint;
      const p256dh = raw?.keys?.['p256dh'];
      const auth = raw?.keys?.['auth'];

      if (!endpoint || !p256dh || !auth) {
        console.error('[PushService] Subscription missing fields:', raw);
        return;
      }

      const pushSubscription = {
        endpoint,
        keys: { p256dh, auth }
      };

      console.log('[PushService] Sending subscription to backend:', pushSubscription);

      this.http.post(environment.apiUrl + '/api/notifications/send', pushSubscription).subscribe({
        next: () => console.log('✅ Subscription sent to backend successfully.'),
        error: err => console.error('❌ Error sending subscription to backend:', err)
      });

    }).catch(err => {
      console.error('❌ Subscription failed:', err);
    });
  }
}