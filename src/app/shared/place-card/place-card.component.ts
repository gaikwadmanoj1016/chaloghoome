import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-place-card',
  standalone: false,
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss'
})
export class PlaceCardComponent {
  @Input() item: any;
  @Output('onNavigateTo') onNavigateTo: EventEmitter<any> = new EventEmitter();

  navigateTo(path: string){
    this.onNavigateTo.emit(path);
  }
}
