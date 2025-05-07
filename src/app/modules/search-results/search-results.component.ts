import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaceDetails } from '../landing-page/place-list/place-details/place-details.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ApiService } from '../../services/api.service';
import { SharedModule } from '../../shared/shared.module';
import { slugify } from '../../utils/slugify';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  query: string = '';
  filter: string = ''; // 'tag' | 'category' | 'section' | 'post'
  results: any;
  isLoading = true;
  searchResults: PlaceDetails[] = [];
  slugify = slugify;
  sections: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private apiRequest: ApiService,
    private seoService: SeoService,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.query = params['query'] ?? '';
      this.commonService.searchedQueryString.next(this.query);
      this.searchData();
    });
  }

  searchData(): void {
    if (this.query) {
      this.isLoading = true;

      this.apiRequest.searchPlaces(this.query).subscribe({
        next: (response: any) => {
          if (response.result) {
            this.searchResults = response.data;

            this.seoService.addCanonicalTag();
            this.seoService.setSEO({
              postName: `Search Results for "${this.query}" - Chalo Ghoome`,
              summary: `Search for ${this.query} and discover top places and attractions with Chalo Ghoome.`,
              originalThumbnailImg: this.commonService.appendAssetUrl(this.searchResults[0].thumbnailImg)
            });
          } else {
            this.searchResults = [];
          }

          this.isLoading = false;
          this.getRecommendedSections();
        },
        error: (error) => {
          console.error("API error: ", error);
          this.searchResults = [];
          this.isLoading = false;
          this.getRecommendedSections();
        }
      });
    } else {
      this.searchResults = [];
      this.isLoading = false;
    }
  }

  getRecommendedSections() {
    this.apiRequest.getSectionWithPosts(10).subscribe((response: any) => {
      if (response.result && response.data && response.data.length > 0) {
        this.sections = response.data.sort((a: any, b: any) => a.order - b.order);
        this.sections = response.data.map((item: any) => {
          item.sectionId = slugify(item.sectionName, '-');
          return item;
        });
      } else {
        this.sections = [];
      }
    })
  }

  ngOnDestroy(): void {
    this.commonService.searchedQueryString.next('');
  }
}
