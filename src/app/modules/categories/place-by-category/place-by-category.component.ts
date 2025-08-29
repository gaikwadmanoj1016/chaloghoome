import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { slugify } from '../../../utils/slugify';
import { ApiService } from '../../../shared/services/api.service';
import { CommonService } from '../../../shared/services/common.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-place-by-category',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './place-by-category.component.html',
  styleUrl: './place-by-category.component.scss'
})
export class PlaceByCategoryComponent {
  public places: any[] = [];
  // cardEditable: boolean = false;
  // selectedCard: any;
  // showHidePostForm: boolean = false;
  // slugify = slugify;
  filteredPlaces: any[] = [];
  slugifiedCatName: string = '';
  catName: string = '';
  constructor(private route: ActivatedRoute, private apiService: ApiService, public commonService: CommonService) {

  }

  ngOnInit(): void {
    this.commonService.setCanonicalURL();
    // this.cardEditable = this.route.snapshot.routeConfig?.path?.includes('sections') || false;
    this.route.params.subscribe((params: any) => {
      if (params && params['catName']) {
        this.slugifiedCatName = params['catName'];
        this.catName = this.slugifiedCatName.split('_').join(' ');
        this.getAllplacesByCategory();
      }
    })
  }

  getAllplacesByCategory() {
    this.apiService.getAllplacesByCategory(this.slugifiedCatName).subscribe((response: any) => {
      if (response.result) {
        this.places = response.data;
        if (this.places && this.places.length > 0) {
          this.places.forEach((item: any) => {
            item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg) || '../../../assets/imgs/image-placeholder.jpg';
          });
          // this.commonService.setMetaData(`${this.places.length} Places information`, {summary: "Explore breathtaking destinations, immerse yourself in cultures, and create memories that last a lifetime.", originalThumbnailImg: this.places[0].thumbnailImg});
          this.commonService.setMetaData(this.catName);
        }
        this.filteredPlaces = [...this.places];
      } else {

      }
    })
  }

  navigateTo(path: string) {
    this.commonService.navigateTo(path);
  }

  public onLocalSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (!searchTerm) {
      this.filteredPlaces = [...this.places]; // Reset if empty
      return;
    }

    this.filteredPlaces = this.places.filter(place =>
      place.postName.toLowerCase().includes(searchTerm) ||
      place.summary.toLowerCase().includes(searchTerm) ||
      place.location.toLowerCase().includes(searchTerm)
    );
  }
}
