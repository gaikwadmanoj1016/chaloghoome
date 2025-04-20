import { Injectable, Inject } from '@angular/core';
import { PlaceDetails } from '../modules/landing-page/place-list/place-details/place-details.component';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // Set title and meta tags dynamically
  setMetaTags(place: PlaceDetails): void {
    this.titleService.setTitle(`${place.postName} - Chalo Ghoome`);
    this.metaService.updateTag({ name: 'description', content: place.summary });
    this.metaService.updateTag({ name: 'keywords', content: place.specialities?.map(item => item.speciality).join(', ') });

    // OpenGraph Meta Tags (For Facebook, Twitter, etc.)
    this.metaService.updateTag({ property: 'og:title', content: place.postName });
    this.metaService.updateTag({ property: 'og:description', content: place.summary });
    this.metaService.updateTag({ property: 'og:image', content: place.originalThumbnailImg || ''});
    this.metaService.updateTag({ property: 'og:url', content: this.document.URL });
  }

  // Add Structured Data (JSON-LD) for SEO
  addStructuredData(place: PlaceDetails): void {
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

  // Add Canonical Tag
  addCanonicalTag(): void {
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', this.document.URL);
    this.document.head.appendChild(link);
  }

  // Full SEO setup
  setSEO(place: any): void {
    this.setMetaTags(place);       // Set Title and Meta Tags
    this.addStructuredData(place); // Add Structured Data (JSON-LD)
    this.addCanonicalTag();        // Add Canonical Tag
  }
}
