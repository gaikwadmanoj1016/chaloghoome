import { Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // @ViewChild('nav') nav: 
  @ViewChild('navbar', { static: false }) nav!: ElementRef;
  @Input() isScrolled: boolean = false;
  isMobileView: boolean = false;

  constructor(private router: Router, public commonService: CommonService, private renderer: Renderer2) {
  }
  ngAfterViewInit() {
    this.checkScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth <= 550) {
      this.isMobileView = true;
    };
  }
  showNav(): boolean {
    const currentRoute = this.router.url;
    return !currentRoute.includes('login') && !currentRoute.includes('register');
  }
  addClass(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('home') || currentRoute.includes('profile');
  }

  public navigateTo(path: string) {
    if (path === 'hidden_gems' || path === 'wonders_of_world' || path === 'most_visited_places') {
      this.commonService.navigateToQueryParams('home', { section: path })
    } else {
      this.commonService.navigateTo(path);
    }
  }

  scrollTo(sectionId: string) {
    this.commonService.scrollToDiv(sectionId);
  }
}
