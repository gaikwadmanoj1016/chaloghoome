import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SitemapService {
  generateSitemap(routes: string[]): string {
    const baseUrl = 'https://chaloghoome.com.com/#'; // Replace with your domain
    const urls = routes.map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`
    );

    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join('\n')}
    </urlset>`;
  }
}
