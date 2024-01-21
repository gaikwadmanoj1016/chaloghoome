import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-custom-cropper-modal',
  templateUrl: './custom-cropper-modal.component.html',
  styleUrl: './custom-cropper-modal.component.scss'
})
export class CustomCropperModalComponent implements OnInit {
  @Input('imageChangedEvent') imageChangedEvent: any;
  @Input('fileName') fileName: string = '';
  @Input('aspectRatio') aspectRatio: number = 1;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
  @Output() onImageCropped: EventEmitter<any> = new EventEmitter();
  croppedImage: any;
  croppedImageBinaryFile: File | undefined;
  constructor(
    private sanitizer: DomSanitizer
  ) {
  }
  ngOnInit(): void {

  }
  imageCropped(event: ImageCroppedEvent) {
    if (event && event.blob) {
      // Convert the blob to a File
      this.croppedImageBinaryFile = new File([event.blob], 'cropped_image.png');
      console.log(this.croppedImageBinaryFile);
      if (event && typeof event.objectUrl === 'string') {
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      }
    }
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
    console.log(image);
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  closeModal() {
    this.onCloseModal.emit();
  }

  submit() {
    this.onImageCropped.emit({ binaryFile: this.croppedImageBinaryFile, filePath: this.croppedImage });
    this.closeModal();
  }
}
