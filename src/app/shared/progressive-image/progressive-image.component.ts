import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-progressive-image',
  standalone: false,
  // imports: [],
  templateUrl: './progressive-image.component.html',
  styleUrl: './progressive-image.component.scss'
})
export class ProgressiveImageComponent {
  @Input() smallImage: string = '';
  @Input() image: string = '';
  @Input() srcSet: string = '';
  @Input() altText: string = '';
  @Output('onImageLoaded') onImageLoaded: EventEmitter<any> = new EventEmitter();

  isLoaded: boolean = false;
  onImageLoad() {
    this.isLoaded = true;
    this.onImageLoaded.emit();
  }
}
