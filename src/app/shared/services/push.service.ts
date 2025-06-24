import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  readonly VAPID_PUBLIC_KEY = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE-iekZ8YF85hhOyO4K7ZgM_Ph99QVz5yT5OS9V_XvQi_ZyV10vwkaeeFYHKlHIWCdyaeoY64xjsqbZQadAHP_Eg';

  constructor(private swPush: SwPush, private http: HttpClient) { }

  subscribeToNotifications() {
    if (!this.swPush.isEnabled) {
      console.error('Service Worker is not enabled!');
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(subscription => {
      const raw = subscription.toJSON();
      const endpoint = raw?.endpoint;
      const p256dh = raw?.keys?.['p256dh'];
      const auth = raw?.keys?.['auth'];

      if (!endpoint || !p256dh || !auth) {
        console.error('Invalid push subscription format:', raw);
        return;
      }

      const pushSubscription = {
        endpoint,
        keys: { p256dh, auth }
      };

      this.http.post('/api/notifications/send', pushSubscription).subscribe({
        next: () => console.log('✅ Subscription sent to server'),
        error: err => console.error('❌ Error sending subscription', err)
      });
    }).catch(err => console.error('❌ Subscription failed', err));
  }

}
