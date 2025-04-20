import { Component, OnInit } from '@angular/core';
import { PlaceDetails } from '../landing-page/place-list/place-details/place-details.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { ApiService } from '../../services/api.service';
import { NgFor, NgIf } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, SharedModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  query: string = '';
  filter: string = ''; // 'tag' | 'category' | 'section' | 'post'
  results: any;
  isLoading = true;
  searchResults: PlaceDetails[] = [];
  slugify = slugify;
  constructor(
    private route: ActivatedRoute,
    private apiRequest: ApiService,
    private seoService: SeoService
  ) { }

  ngOnInit(): void {
    // Get the search query from the URL
    this.query = this.route.snapshot.queryParamMap.get('query') || '';

    this.route.queryParamMap.subscribe(params => {
      this.query = params.get('query') ?? '';

      this.searchData();
    });
  }

  searchData(): void {
    //   // Fetch search results based on the query
    if (this.query) {
      this.apiRequest.searchPlaces(this.query).subscribe((response: any) => {
        this.searchResults = response.data;
        this.isLoading = false;

        this.seoService.addCanonicalTag();
        // Update SEO meta tags
        this.seoService.setSEO({
          postName: `Search Results for "${this.query}" - Chalo Ghoome`,
          summary: `Search for ${this.query} and discover top places and attractions with Chalo Ghoome.`,
          originalThumbnailImg: 'default-image-url.jpg' // Adjust this as needed
        });
      });
      // specialities: [this.query, 'travel', 'places'],
    }
  }
}
