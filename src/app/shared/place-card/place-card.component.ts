import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-place-card',
  standalone: false,
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss'
})
export class PlaceCardComponent implements OnInit {
  @Input() item: any;
  @Output('onNavigateTo') onNavigateTo: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
      this.item.loaded = false;
  }
  navigateTo(path: string){
    this.onNavigateTo.emit(path);
  }

  imageLoaded(event: any){
    this.item.loaded = event;
    console.log(this.item);
  }
}
