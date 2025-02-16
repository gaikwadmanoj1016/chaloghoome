import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '../../../../shared/image-preview/image-preview.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ApiService } from '../../../../services/api.service';
import { SharedModule } from '../../../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


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
  isUnique: boolean | string;
}

export interface Highlight {
  imagePath: string;
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
  imports: [SharedModule, HttpClientModule],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent implements OnInit {
  placeDetails: PlaceDetails | undefined;
  placeId: number = 0;
  postId: any;
  constructor(private dialog: MatDialog, private route: ActivatedRoute, public commonService: CommonService, private apiRequest: ApiService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      if (param && param['placeId']) {
        this.placeId = param['placeId'];
        this.getPlaceDetails();
      }
    })
    this.route.params.subscribe((param: any) => {
      if (param && param['postId']) {
        this.postId = param['postId'];
        this.getPlaceDetailsByPlaceId();
      }
    })
  }

  private getPlaceDetailsByPlaceId() {
    this.apiRequest.getPostDetails(this.postId).subscribe((response: any) => {
      this.placeDetails = response.data;
    })
  }
  private getPlaceDetails() {
    this.apiRequest.getPlaceDetails().subscribe((response: any) => {
      console.log(response)
      this.placeDetails = response.find((item: any) => item.id === Number(this.placeId));
      console.log(this.placeDetails)
    })
  }
  openPreview(url: string): void {
    let imageUrl = url;
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl },
      panelClass: 'custom-dialog-container' // Optional custom styling
    });
  }
}
