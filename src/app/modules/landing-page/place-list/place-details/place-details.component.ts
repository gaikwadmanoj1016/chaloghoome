import { AfterViewInit, Component, OnDestroy, OnInit, Inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '../../../../shared/components/image-preview/image-preview.component';
import { ActivatedRoute, NavigationEnd, Router, Event as RouterEvent, RouterLink, RouterOutlet } from '@angular/router';
import { CommonService } from '../../../../shared/services/common.service';
import { ApiService } from '../../../../shared/services/api.service';
import { SharedModule } from '../../../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { convertSlugToNormal, slugify } from '../../../../utils/slugify';
import { BreadcrumbSchemaService } from '../../../../shared/services/breadcrumb-schema.service';
import { AriaDescriber } from '@angular/cdk/a11y';
import { filter } from 'rxjs';


export interface PlaceDetails {
  facts: string;
  originalThumbnailImg: string | undefined;
  name: string;
  area: string;
  yearEstablished: string;
  postName: string;
  slugifiedPostName: string;
  summary: string;
  location: string;
  history: string;
  uniqueFeature: string;
  bestTimeToVisit: string;
  famousFor: string;
  annualVisitors: string;
  howToGo: string;
  routes: string;
  thumbnailImg: string;
  otherFeatures: string[];
  highlights: Highlight[];
  travelGuide: TravelGuide[];
  specialities: Speciality[];
  postCatList: any[];
  postTagList: any[];
  createdAt: string;
  sectionId: number;
}

export interface Speciality {
  speciality: string;
  description: string;
  isUnique: boolean;
}

export interface Highlight {
  isThumbnail: boolean;
  imagePath: string;
  compressedImagePath: string;
  title: string;
  description: string;
}

export interface TravelGuide {
  title: string;
  para?: string;
  bulletPoints?: any[];
}

@Component({
  selector: 'app-place-details',
  standalone: true,
  imports: [SharedModule, HttpClientModule, RouterLink, NgIf, NgFor],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
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
  sectionLoader = signal(false);
  topCategories: any[] = [];
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private apiRequest: ApiService,
    private router: Router,
    private breadcrumbSchema: BreadcrumbSchemaService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.commonService.setCanonicalURL();
    this.route.params.subscribe((param: any) => {
      if (param && param['postName']) {
        this.postName = param['postName'];
        // this.postName = convertSlugToNormal(tempArr[0], '-');
        // this.originalPostName = tempArr[1];
        this.getPlaceDetailsByPlaceId(this.postName);
      }
    });
    this.commonService.routeChanged.subscribe((event: any) => {
      console.log(event);
      this.checkFragmentPresent(event.url);
    })
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

  checkFragmentPresent(url: string) {
    let values = url.split('#');
    if (values && values.length > 1) {
      console.log("current url", values[0]);
      console.log("current fragment", values[1]);
      let fragment = values[1];
      this.commonService.scrollToDiv(fragment, 70);
    }
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
            this.commonService.scrollToTop();
            this.sectionLoader.set(true);
            this.getTopCategories();
            setTimeout(() => {
              this.getPostBySectionId(this.placeDetails?.sectionId);
            }, 2000);
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

  private getPostBySectionId(sectionId?: number) {
    // localStorage.setItem('sections', JSON.stringify(this.commonService.sections));
    sectionId = this.commonService.sections.find((item: any) => item.sectionName.trim().toLowerCase() === this.sectionName.trim().toLowerCase())?.id;
    // // this.list = this.commonService.wonders;
    console.log("section id : ", sectionId);
    if (sectionId) {
      this.apiRequest.getPostBySectionId(sectionId).subscribe((response) => {
        this.sectionLoader.set(false);
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
        title: this.placeDetails?.postName + ' | ' + (this.placeDetails?.location || ''),
        text: (this.placeDetails && this.placeDetails.summary.length > 100) ? this.placeDetails?.summary.substring(0, 100) + '...' : this.placeDetails?.summary,
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

  private getTopCategories() {
    let limit = 10;
    this.apiRequest.getTopCategories(limit).subscribe((response: any) => {
      if (response.result) {
        if (response.data && response.data.length > 0) {
          this.topCategories = response.data;
          this.topCategories.forEach((item: any) => {
            item.slugifiedCatName = item.catName.split(' ').join('_');
          });
        }
      } else {
        this.topCategories = [];
      }
    })
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }
}
