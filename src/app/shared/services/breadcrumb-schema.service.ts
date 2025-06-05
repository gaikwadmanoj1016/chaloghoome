// breadcrumb-schema.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BreadcrumbSchemaService {
  constructor(@Inject(DOCUMENT) private doc: Document, @Inject(PLATFORM_ID) private platformId: Object) {}

  injectBreadcrumbJsonLd(breadcrumbs: { name: string, url: string }[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scriptId = 'breadcrumb-jsonld';
    const existing = this.doc.getElementById(scriptId);
    if (existing) {
      existing.remove(); // Remove old if exists
    }

    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((bc, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": bc.name,
        "item": bc.url
      }))
    };

    const script = this.doc.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbList);
    this.doc.head.appendChild(script);
  }
}
