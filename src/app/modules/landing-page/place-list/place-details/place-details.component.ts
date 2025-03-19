import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '../../../../shared/image-preview/image-preview.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ApiService } from '../../../../services/api.service';
import { SharedModule } from '../../../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgStyle } from '@angular/common';


export interface PlaceDetails {
  name: string;
  area: string;
  yearEstablished: string;
  postName: string;
  summary: string;
  history: string;
  uniqueFeature: string;
  bestTimeToVisit: string;
  famousFor: string;
  howToGo: string;
  otherFeatures: string[];
  highlights: Highlight[];
  travelGuide: TravelGuide[];
  specialities: Speciality[];
}

export interface Speciality {
  speciality: string;
  description: string;
  isUnique: boolean;
}

export interface Highlight {
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
  imports: [SharedModule, HttpClientModule, NgStyle],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent implements OnInit, AfterViewInit, OnDestroy{
  placeDetails: PlaceDetails | undefined;
  placeId: number = 0;
  postId: any;
  currentIndex = 0;
  autoSlideInterval: any;
  constructor(
    private dialog: MatDialog, 
    private route: ActivatedRoute, 
    public commonService: CommonService, 
    private apiRequest: ApiService,
  ) { }

  ngOnInit(): void {
    // this.route.queryParams.subscribe((param: any) => {
    //   if (param && param['placeId']) {
    //     this.placeId = param['placeId'];
    //     this.getPlaceDetails();
    //   }
    // })
    this.route.params.subscribe((param: any) => {
      if (param && param['postId']) {
        this.postId = param['postId'];
        this.getPlaceDetailsByPlaceId();
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startAutoSlide();
    }, 2000);
  }

  private getPlaceDetailsByPlaceId() {
    this.apiRequest.getPostDetails(this.postId).subscribe((response: any) => {
      this.placeDetails = response.data;

      if (this.placeDetails && Object.keys(this.placeDetails).length > 0) {
        this.commonService.setMetaData(this.placeDetails?.postName, this.placeDetails?.summary);
      }
    })
  }
  // private getPlaceDetails() {
  //   this.apiRequest.getPlaceDetails().subscribe((response: any) => {
  //     this.placeDetails = response.find((item: any) => item.id === Number(this.placeId));
  //   })
  // }
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
  

  goToSlide(index: number) {
    this.pauseAutoSlide();
    this.currentIndex = index;
    this.resumeAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

}
