import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-highlights-modal',
  standalone: false,
  templateUrl: './highlights-modal.component.html',
  styleUrl: './highlights-modal.component.scss'
})
export class HighlightsModalComponent implements OnInit {
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();

  @Input() isModalOpen = false;
  @Input() cardDetails: any;
  @Input() highlights: any[] = [];
  highlightForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    img: new FormControl(null),
    compressedImage: new FormControl(null),
    isThumbnail: new FormControl(false)
  });
  file!: File;

  constructor(public commonService: CommonService, private apiService: ApiService) { }
  ngOnInit(): void {
    console.log(this.cardDetails);
    this.getHighlights();
  }

  private getHighlights() {
    this.apiService.getHighlights(this.cardDetails.id).subscribe((response) => {
      if (response.result) {
        this.highlights = response.data;
      } else {
        this.highlights = [];
      }
    })
  }

  addHighlights(item: any) {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.onCloseModal.emit();
  }

  onImageSelect(event: any) {
    this.file = event.target.files[0];
  }

  async saveHighlights(action: string, highlight?: any) {
    const formData = new FormData();

    if (action === 'edit' && highlight) {
      formData.append('highlights[0].isThumbnail', String(highlight.isThumbnail));
      formData.append('id', this.cardDetails.id);
      formData.append('highlights[0].description', highlight.description || '');
      formData.append('highlights[0].title', highlight.title || '');
      formData.append('highlights[0].id', highlight.id.toString());
    } else if (action === 'add') {
      formData.append('id', this.cardDetails.id);
      formData.append('highlights[0].title', this.highlightForm.value.title || '');
      formData.append('highlights[0].description', this.highlightForm.value.description || '');
      formData.append('highlights[0].isThumbnail', String(this.highlightForm.get('isThumbnail')?.value));
      if (this.file) {
        formData.append('highlights[0].img', this.file);
        // Compress the image and append as compressedImg
        const compressedFile = await this.commonService.compressImage(this.file, 0.5); // Scale to 50%
        formData.append('highlights[0].compressedImg', compressedFile);
      }
    } else {
      console.error('data insufficient')
    }
    this.apiService.saveHighlight(formData).subscribe((response) => {
      if (response.result) {
        this.getHighlights();
      } else {
        console.error(response.message || 'something went wrong');
      }
    })
  }

  public changeThumbnail(highlight: any) {
    highlight.isThumbnail = true;
    this.saveHighlights('edit', highlight);
  }
}
