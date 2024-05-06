import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buddy-card',
  standalone: false,
  templateUrl: './buddy-card.component.html',
  styleUrl: './buddy-card.component.scss'
})
export class BuddyCardComponent {
  @Input() buddyDetails: any;
}
