import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ImagePreviewComponent } from '../../../../shared/image-preview/image-preview.component';
import { Highlight, PlaceDetails } from '../place-details/place-details.component';
import { NgStyle } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { DOCUMENT } from '@angular/common';
import { convertSlugToNormal, slugify } from '../../../../utils/slugify';

@Component({
  selector: 'app-place-details-new',
  standalone: true,
  imports: [NgStyle, SharedModule],
  templateUrl: './place-details-new.component.html',
  styleUrl: './place-details-new.component.scss'
})
export class PlaceDetailsNewComponent implements OnInit, AfterViewInit, OnDestroy {
  placeDetails: PlaceDetails | undefined;
  placeId: number = 0;
  postName: string = '';
  currentIndex = 0;
  autoSlideInterval: any;
  highlights?: Highlight[] = [];
  loadedAllImage: boolean = false;
  imgSrc = 'assets/imgs/image-placeholder.jpg';

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private apiRequest: ApiService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => {
      if (param && param['postName']) {
        this.postName = convertSlugToNormal(param['postName'], '-');
        this.getPlaceDetailsByPlaceId();
      }
    });
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', this.document.URL);
    this.document.head.appendChild(link);
  }

  onImageError() {
    this.imgSrc = 'assets/imgs/image-placeholder.jpg';
  }
  
  onImageLoad() {
    // Optional: Add logic or class for when image has fully loaded
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startAutoSlide();
    }, 2000);
  }

  private getPlaceDetailsByPlaceId() {
    let query = `postName=${this.postName}`;
    this.apiRequest.getPostDetails(query).subscribe((response: any) => {
      this.placeDetails = response.data;
      if (this.placeDetails && this.placeDetails.highlights && this.placeDetails.highlights.length > 0) {
        this.placeDetails.originalThumbnailImg = this.placeDetails.highlights.find(item => item.isThumbnail)?.imagePath
      }
      if (this.placeDetails && Object.keys(this.placeDetails).length > 0) {
        this.commonService.setMetaData(this.placeDetails?.postName, this.placeDetails);
        this.addStructuredData(this.placeDetails);
      }
      const originalImg = this.placeDetails?.originalThumbnailImg;
      if (originalImg) {
        this.imgSrc = this.commonService.appendAssetUrl(originalImg);
      }
  
      this.setGallary();
    })
  }

  addStructuredData(place: PlaceDetails) {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": place.postName,
      "description": place.summary,
      "image": place.originalThumbnailImg,
      "url": this.document.URL,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": place.location
      }
    });
    this.document.head.appendChild(script);
  }

  setGallary() {
    if (this.placeDetails?.highlights && this.placeDetails?.highlights.length > 10) {
      this.highlights = this.placeDetails?.highlights.splice(0, 10);
      this.loadedAllImage = false;
    } else {
      this.loadAllImagesToGallary();
    }
    // this.placeDetails?.highlights
  }

  public loadAllImagesToGallary() {
    this.highlights = this.placeDetails?.highlights;
    this.loadedAllImage = true;
  }
  openPreview(url: string): void {
    let imageUrl = url;
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container' // Optional custom styling
    });
  }

  startAutoSlide() {
    this.stopAutoSlide(); // Clear any existing interval first
    this.autoSlideInterval = setInterval(() => {
      if (this.placeDetails?.highlights && this.currentIndex < this.placeDetails.highlights.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Loop back to start
      }
    }, 3000); // Change slide every 3 seconds
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  pauseAutoSlide() {
    this.stopAutoSlide();
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  prevSlide() {
    this.pauseAutoSlide();
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = (this.placeDetails && this.placeDetails.highlights.length - 1) || 0;
    }
    this.resumeAutoSlide();
  }

  nextSlide() {
    this.pauseAutoSlide();
    if (this.placeDetails?.highlights && this.placeDetails?.highlights.length > 0) {
      if (this.placeDetails?.highlights && this.currentIndex < this.placeDetails?.highlights.length - 1) {
        this.currentIndex++;
      } else if (this.currentIndex === this.placeDetails?.highlights.length - 1) {
        this.currentIndex = 0;
      }
    }
    this.resumeAutoSlide();
  }

  public checkLastIndex(index: number) {
    return this.highlights && this.highlights.length === (index + 1);
  }
  public checkHighlightExist() {
    return this.placeDetails?.highlights && this.placeDetails?.highlights.length > 0;
  }

  updateFormattedText(value?: string) {
    // Preserve formatting with line breaks and bold text
    if (value) {

      return value
        .replace(/\n/g, '<br>') // Preserve line breaks
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Preserve bold text
    }
    return '';
  }

  goToSlide(index: number) {
    this.pauseAutoSlide();
    this.currentIndex = index;
    this.resumeAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

}
