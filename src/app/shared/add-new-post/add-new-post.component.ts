import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-new-post',
  templateUrl: './add-new-post.component.html',
  styleUrl: './add-new-post.component.scss'
})
export class AddNewPostComponent {
  @Input() isOpen: boolean = false;
  @Output() toggelModal: EventEmitter<any> = new EventEmitter();

  public multipleFiles: File[] = [];
  public uploadedFiles: File[] = [];

  constructor(private cdRef: ChangeDetectorRef){}
  closeModal() {
    this.toggelModal.emit(false);
  }

  handleMultipleFileUpload(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.multipleFiles = Array.from(fileList);
      this.uploadedFiles = this.uploadedFiles.concat(this.multipleFiles);
      this.markForCheck(); 
    }
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getSafeUrl(file: File): any {
    return URL.createObjectURL(file);
  }

  submitPost() {
    this.closeModal();
  }

  removeFile(index: any){
    console.log(index);
    this.uploadedFiles.splice(index, 1);
  }

  markForCheck(): void {
    this.cdRef.markForCheck();
  }
}
