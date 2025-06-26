import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { Messaging, getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { environment } from '../../../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FCMService {
  private app: FirebaseApp | undefined;
  private messaging: Messaging | undefined;

  // BehaviorSubject to hold the current FCM token, starting with null.
  private _tokenSubject = new BehaviorSubject<string | null>(null);
  // Expose token as an Observable for other components to subscribe to.
  public token$: Observable<string | null> = this._tokenSubject.asObservable();

  // BehaviorSubject to hold an array of received messages.
  private _messagesSubject = new BehaviorSubject<any[]>([]);
  // Expose messages as an Observable.
  public messages$: Observable<any[]> = this._messagesSubject.asObservable();

  constructor() {
    // Initialize Firebase upon service instantiation.
    // This ensures Firebase is ready as soon as the service is provided.
    this.initFirebase();
  }

  /**
   * Initializes Firebase and sets up Cloud Messaging.
   * Checks if Firebase is already initialized to prevent errors when multiple services/components
   * might try to initialize it.
   */
  private async initFirebase(): Promise<void> {
    try {
      // Attempt to get an existing Firebase app instance.
      this.app = getApp();
    } catch (e) {
      // If no app exists, initialize a new one with the configuration.
      this.app = initializeApp(environment.firebaseConfig);
    }

    try {
      // Check if Firebase Messaging APIs are supported by the current browser.
      const supported = await isSupported();
      if (supported) {
        // If supported, get the Messaging service instance.
        this.messaging = getMessaging(this.app);
        // Start listening for foreground messages.
        this.listenForMessages();
        console.log('Firebase Messaging initialized and supported.');
        // Also check if permission is already granted and try to get token
        this.checkAndGetToken();
      } else {
        console.warn('Firebase Messaging is not supported in this browser. Push notifications will not work.');
      }
    } catch (error) {
      console.error('Error initializing Firebase Messaging:', error);
      // Handle initialization errors, e.g., display a user-friendly message.
    }
  }

  /**
   * Requests notification permission from the user and retrieves the FCM device token.
   * This method typically gets called in response to a user action (e.g., button click).
   * The token is crucial for sending targeted push notifications to this specific device.
   */
  public async requestPermission(): Promise<void> {
    if (!this.messaging) {
      console.error('Firebase Messaging not initialized. Cannot request permission.');
      return;
    }

    try {
      // Prompt the user for notification permission.
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // If permission is granted, retrieve the FCM token.
        // The `vapidKey` is required to authorize your app with FCM.
        const token = await getToken(this.messaging, { vapidKey: environment.firebaseConfig.vapidKey });
        // console.log('FCM Token:', token);
        // Update the BehaviorSubject so any subscribers (e.g., UI components) get the new token.
        this._tokenSubject.next(token);
      } else {
        console.warn('Notification permission denied or dismissed.');
        this._tokenSubject.next(null); // Clear the token if permission is denied.
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
      this._tokenSubject.next(null);
    }
  }

  /**
   * Checks the current notification permission status and attempts to retrieve the token
   * if permission is already granted. This is useful on application load.
   */
  private async checkAndGetToken(): Promise<void> {
    if (Notification.permission === 'granted' && this.messaging) {
      try {
        const currentToken = await getToken(this.messaging, { vapidKey: environment.firebaseConfig.vapidKey });
        if (currentToken) {
          // console.log('Existing FCM Token:', currentToken);
          this._tokenSubject.next(currentToken);
        } else {
          console.warn('Could not retrieve existing token, even with permission granted.');
          this._tokenSubject.next(null);
        }
      } catch (error) {
        console.error('Error retrieving existing token:', error);
        this._tokenSubject.next(null);
      }
    } else if (Notification.permission === 'default') {
      console.log('Notification permission is default. User needs to grant it.');
    } else {
      console.warn('Notification permission denied.');
      this._tokenSubject.next(null);
    }
  }

  /**
   * Sets up a listener for incoming messages when the Angular application is in the foreground.
   * Messages received while the app is active will trigger this callback, allowing you to
   * display messages directly in the UI or create local notifications.
   */
  private listenForMessages(): void {
    if (!this.messaging) {
      console.error('Firebase Messaging not initialized for message listening.');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground. ', payload);
      // Get current messages, add the new one, and update the subject.
      const currentMessages = this._messagesSubject.getValue();
      this._messagesSubject.next([...currentMessages, payload]);

      // Manually display a notification for foreground messages.
      // Firebase does NOT automatically show system notifications for foreground messages.
      if (payload.notification) {
        new Notification(payload.notification.title || 'New Message', {
          body: payload.notification.body,
          icon: payload.notification.icon || '/favicon.ico' // Ensure this path is correct for your app's icon
        });
      }
    });
  }
}