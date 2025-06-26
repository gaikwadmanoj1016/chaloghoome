import { Component } from '@angular/core';
import { FCMService } from '../../shared/services/fcm.service';
import { JsonPipe, AsyncPipe, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-push-notification-setup',
  standalone: true,
  imports: [JsonPipe, AsyncPipe, NgIf, NgFor],
  templateUrl: './push-notification-setup.component.html',
  styleUrl: './push-notification-setup.component.scss'
})
export class PushNotificationSetupComponent {
  constructor(public fcmService: FCMService) { }

  requestNotificationPermission(): void {
    this.fcmService.requestPermission();
  }
}
