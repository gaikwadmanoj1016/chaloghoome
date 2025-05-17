import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { ImagePreviewComponent } from '../../../../shared/image-preview/image-preview.component';
import { Highlight, PlaceDetails } from '../place-details/place-details.component';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { DOCUMENT } from '@angular/common';
import { convertSlugToNormal, slugify } from '../../../../utils/slugify';
import { BreadcrumbSchemaService } from '../../../../services/breadcrumb-schema.service';
import { AriaDescriber } from '@angular/cdk/a11y';

@Component({
  selector: 'app-place-details-new',
  standalone: true,
  imports: [SharedModule, NgIf, NgFor, RouterLink],
  templateUrl: './place-details-new.component.html',
  styleUrl: './place-details-new.component.scss'
})
export class PlaceDetailsNewComponent implements OnInit, AfterViewInit, OnDestroy {
  placeDetails: PlaceDetails | undefined = undefined;
  placeId: number = 0;
  postName: string = '';
  currentIndex = 0;
  autoSlideInterval: any;
  highlights?: Highlight[] = [];
  loadedAllImage: boolean = false;
  // imgSrc = 'assets/imgs/image-placeholder.jpg';
  imgSrc = '';
  originalPostName: string = '';
  apiCallCount: number = 0;
  // tags = ['Adventure', 'Nature', 'Wildlife', 'Adventure', 'Nature', 'Wildlife', 'Adventure', 'Nature', 'Wildlife'];
  // categories = ['Trekking', 'Photography', 'Camping'];
  placeNotFound: boolean = false;
  loadingPlaceDetails: boolean = false;
  facts: string[] = [];
  section: any;
  sectionName: any = "Most Visited Places";
  slugify = slugify;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private apiRequest: ApiService,
    private breadcrumbSchema: BreadcrumbSchemaService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param: any) => {
      if (param && param['postName']) {
        this.postName = param['postName'];
        // this.postName = convertSlugToNormal(tempArr[0], '-');
        // this.originalPostName = tempArr[1];
        this.getPlaceDetailsByPlaceId(this.postName);
      }
    });
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', this.document.URL);
    this.document.head.appendChild(link);

    // todo 
    // this.breadcrumbSchema.injectBreadcrumbJsonLd([
    //   { name: 'Places', url: 'https://yourtravelblog.com/places' },
    //   { name: 'Most Visited Places', url: 'https://yourtravelblog.com/places/most-visited-places' },
    //   { name: 'Taj Mahal', url: 'https://yourtravelblog.com/places/taj-mahal' }
    // ]);
  }

  onImageError() {
    // this.imgSrc = 'assets/imgs/image-placeholder.jpg';
    this.imgSrc = '';
  }

  onImageLoad() {
    // Optional: Add logic or class for when image has fully loaded
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startAutoSlide();
    }, 2000);
  }

  private getPlaceDetailsByPlaceId(postName: string) {
    this.loadingPlaceDetails = true;
    this.apiCallCount++;
    let query = `postName=${postName}`;
    this.apiRequest.getPostDetails(query).subscribe({
      next: (response: any) => {
        this.loadingPlaceDetails = false;
        if (response && response.result) {
          this.placeDetails = response.data;
          if (this.placeDetails && Object.keys(this.placeDetails).length > 0) {
            if (this.placeDetails.highlights && this.placeDetails.highlights.length > 0) {
              this.placeDetails.originalThumbnailImg = this.placeDetails.highlights.find(item => item.isThumbnail)?.imagePath
              // const originalImg = this.placeDetails?.originalThumbnailImg;
              if (this.placeDetails.originalThumbnailImg) {
                this.imgSrc = this.commonService.appendAssetUrl(this.placeDetails.originalThumbnailImg);
                console.log(this.imgSrc);
              }
            }
            if (this.placeDetails.facts) {
              this.facts = this.placeDetails.facts?.split('.,');
            }
            this.placeNotFound = false;
            this.commonService.setMetaData(this.placeDetails?.postName, this.placeDetails);
            this.addStructuredData(this.placeDetails);
            this.setGallary();
            this.getPostBySectionId();
            this.commonService.scrollToTop();
          } else {
            this.placeNotFound = true;
          }
        }
      },
      error: (err) => {
        this.loadingPlaceDetails = false;
        this.placeNotFound = true;
        console.error('API failed:', err);
        if (this.apiCallCount === 1 && this.originalPostName && postName !== this.originalPostName) {
          this.getPlaceDetailsByPlaceId(this.originalPostName);
        } else {
          console.warn('Fallback API also failed.');
        }
      }
    });
  }

  private getPostBySectionId() {
    localStorage.setItem('sections', JSON.stringify(this.commonService.sections));
    let sectionId = this.commonService.sections.find((item: any) => item.sectionName.trim().toLowerCase() === this.sectionName.trim().toLowerCase())?.id;
    // this.list = this.commonService.wonders;
    console.log("section id : ", sectionId);

    if (sectionId) {
      this.apiRequest.getPostBySectionId(sectionId).subscribe((response) => {
        if (response.result) {
          this.section = response.data;
          if (this.section && this.section.posts && this.section.posts.length > 0) {
            this.section.posts.forEach((item: any) => {
              item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
            })
          }
          // this.commonService.setMetaData(this.section.sectionName);
        } else {
          this.section = [];
        }
      })
    }
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
    this.highlights = this.placeDetails?.highlights || [];
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

  goToSlide(index: number) {
    this.pauseAutoSlide();
    this.currentIndex = index;
    this.resumeAutoSlide();
  }

  // public searchText(text: string) {
  //   this.commonService.navigateTo('/search/' + text)
  // }

  sharePage() {
    if (navigator.share) {
      navigator.share({
        title: this.placeDetails?.postName +' | '+ (this.placeDetails?.location || ''),
        text: this.placeDetails?.summary,
        url: window.location.href
      })
      .then(() => console.log('Successfully shared'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      alert('Sharing not supported on this browser. Please copy the URL manually.');
    }
  }
  // sharePage() {
  //   const fileUrl = this.imgSrc;
  //   fetch(fileUrl)
  //     .then(res => res.blob())
  //     .then(blob => {
  //       const file = new File([blob], 'travel.jpg', { type: blob.type });

  //       if (navigator.canShare && navigator.canShare({ files: [file] })) {
  //         navigator.share({
  //           title: this.placeDetails?.postName + (this.placeDetails?.location || ''),
  //           text: this.placeDetails?.summary,
  //           url: window.location.href,
  //           files: [file],
  //         })
  //           .then(() => console.log('Shared with image!'))
  //           .catch((error) => console.error('Error sharing', error));
  //       } else {
  //         alert('Image sharing not supported on this browser.');
  //       }
  //     });
  // }

  ngOnDestroy() {
    this.stopAutoSlide();
  }
}
