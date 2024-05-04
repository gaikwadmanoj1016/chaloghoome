import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-place-corousal',
  templateUrl: './place-corousal.component.html',
  styleUrl: './place-corousal.component.scss'
})
export class PlaceCorousalComponent {
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() grid: boolean = false;
  @Input() placesList: any[] = [];

}
