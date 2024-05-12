import { Component, Input } from '@angular/core';

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

  isLoaded: boolean = false;
  onImageLoad() {
    console.log("object");
    this.isLoaded = true;
  }
}
