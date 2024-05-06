import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss'
})
export class ImagePreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) { }

  get imageUrl(): string {
    return this.data.imageUrl;
  }

  handleImageError(event: any) {
    console.error('Error loading image:', event);
  }
}
