import { Component } from '@angular/core';
import { SitemapService } from '../../services/sitemap.service';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss'
})
export class SitemapComponent {
  constructor(private sitemapService: SitemapService) {}

  ngOnInit() {
    const routes = ['/', '/home', '/about_us', '/contact_us']; // Define or fetch dynamically
    const sitemap = this.sitemapService.generateSitemap(routes);

    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    // Create a link to download the sitemap
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();
  }
}
