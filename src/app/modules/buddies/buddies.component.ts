import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../../services/common.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-buddies',
  standalone: true,
  imports: [MatIconModule, SharedModule],
  templateUrl: './buddies.component.html',
  styleUrl: './buddies.component.scss'
})
export class BuddiesComponent {
  buddies = [
    { name: 'Buddy 1', image: 'assets/avatars/1.jpg', status: 'Online', bio: 'sa feiqwd sdf ishfuhdsfh uiwes arweduwerufhudhsfi aserywerdjsf safwe airfea  EWF' },
    { name: 'Buddy 2', image: 'assets/avatars/2.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 3', image: 'assets/avatars/3.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 4', image: 'assets/avatars/4.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 1', image: 'assets/avatars/1.jpg', status: 'Online', bio: 'sa feiqwd sdf ishfuhdsfh uiwes arweduwerufhudhsfi aserywerdjsf safwe airfea  EWF' },
    { name: 'Buddy 2', image: 'assets/avatars/2.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 3', image: 'assets/avatars/3.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 4', image: 'assets/avatars/4.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 1', image: 'assets/avatars/1.jpg', status: 'Online', bio: 'sa feiqwd sdf ishfuhdsfh uiwes arweduwerufhudhsfi aserywerdjsf safwe airfea  EWF' },
    { name: 'Buddy 2', image: 'assets/avatars/2.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 3', image: 'assets/avatars/3.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 4', image: 'assets/avatars/4.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 1', image: 'assets/avatars/1.jpg', status: 'Online', bio: 'sa feiqwd sdf ishfuhdsfh uiwes arweduwerufhudhsfi aserywerdjsf safwe airfea  EWF' },
    { name: 'Buddy 2', image: 'assets/avatars/2.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 3', image: 'assets/avatars/3.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
    { name: 'Buddy 4', image: 'assets/avatars/4.jpg', status: 'Offline', bio: 'jsf eriwe ewu erfuweruwuerf   oer rweo wue ew ' },
  ];
  constructor(private commonService: CommonService) {
    
  }
  public navigateTo(path: string){
    this.commonService.navigateTo(path);
  }

  addBuddy(buddy: any) {
    // Implement add buddy logic
    console.log('Adding buddy:', buddy);
  }

  cancelRequest(buddy: any) {
    // Implement cancel request logic
    console.log('Canceling request for buddy:', buddy);
  }
}
