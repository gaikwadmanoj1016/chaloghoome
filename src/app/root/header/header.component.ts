import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { environment } from '../../../../environment';
import { SearchBarComponent } from "../../shared/components/search-bar/search-bar.component";
declare const SplitText: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  // @ViewChild('nav') nav: 
  @ViewChild('container', { static: false }) containerRef!: ElementRef;

  @ViewChild('normalText', { static: false }) normalText!: ElementRef;
  @ViewChild('strongText', { static: false }) strongText!: ElementRef;
  @ViewChild('brandText', { static: false }) brandText!: ElementRef;
  @ViewChild('brandStrong', { static: false }) brandStrong!: ElementRef;
  @ViewChild('navbarBrand', { static: false }) navbarBrand!: ElementRef;
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  @ViewChild('navbar', { static: false }) nav!: ElementRef;
  @Input() isScrolled: boolean = false;
  @Input() sections: any[] = [];
  isMobileView: boolean = false;
  // apiCallCount: number = 0;

  constructor(private router: Router, public commonService: CommonService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkScreenSize();
  }

  ngAfterViewInit() {
    this.checkScreenSize();
    // Wait for sidebar to open
    if (this.commonService.isSidebarOpen()) {
      this.animateMenuItems();
    }
    // this.animateBrandLogo();
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

  toggleDropdown(event: Event) {
    this.commonService.isDropdownOpen.set(!this.commonService.isDropdownOpen());
  }
  closeDropdown() {
    this.commonService.isDropdownOpen.set(false);
  }
  toggleSidebarDropdown(event: Event) {
    this.commonService.isSidebarDropdownOpen.set(!this.commonService.isSidebarDropdownOpen());
  }
  closeSidebarDropdown() {
    this.commonService.isSidebarDropdownOpen.set(false);
  }

  toggleSidebar(event: Event) {
    event.preventDefault(); // prevent link navigation
    this.commonService.isSidebarOpen.set(!this.commonService.isSidebarOpen());
    if (this.commonService.isSidebarOpen()) {
      setTimeout(() => this.animateMenuItems(), 100); // Wait for DOM render
    }
  }

  closeSidebar() {
    this.commonService.isSidebarOpen.set(false);
  }

  trackByIndex(index: number, item: any) {
    return index;
  }
  // filterData(search: string) {
  //   const query = search.toLowerCase();

  //   const filteredSuggestions = this.allSuggestions.map((suggestion: any) => {
  //     let filteredList = [];

  //     if (suggestion.label.toLowerCase() === 'tags') {
  //       filteredList = suggestion.list.filter((tag: any) =>
  //         tag.tagName.toLowerCase().includes(query)
  //       );
  //     } else if (suggestion.label.toLowerCase() === 'categories') {
  //       filteredList = suggestion.list.filter((cat: any) =>
  //         cat.catName.toLowerCase().includes(query)
  //       );
  //     } else if (suggestion.label.toLowerCase() === 'sections') {
  //       filteredList = suggestion.list
  //         .map((section: any) => {
  //           const matchedPosts = section.posts.filter((post: any) =>
  //             post.postName.toLowerCase().includes(query) ||
  //             post.location.toLowerCase().includes(query) ||
  //             post.summary.toLowerCase().includes(query)
  //           );
  //           return { ...section, posts: matchedPosts };
  //         })
  //         .filter((section: any) => section.posts.length > 0);
  //     }

  //     return {
  //       label: suggestion.label,
  //       list: filteredList
  //     };
  //   }).filter((s: any) => s.list.length > 0); // Only return non-empty results

  //   return filteredSuggestions;
  // }

  // animateBrandLogo() {
  //   gsap.registerPlugin(SplitText);

  //   // Wait for fonts to load before animating
  //   // (document as any).fonts.ready.then(() => {
  //   // gsap.set(this.containerRef.nativeElement, { opacity: 1 });
  //   const split = SplitText.create('.brand-logo', {
  //     type: 'words',
  //     aria: 'hidden',
  //   });
  //   console.log(split.words);
  //   gsap.to(this.containerRef.nativeElement, {
  //     x: 0,
  //     duration: 0.6,
  //     ease: 'power3.out',
  //     delay: 1
  //   });

  //   gsap.from(split.words, {
  //     delay: 1,
  //     opacity: 0,
  //     duration: 1,
  //     ease: 'power3.out',
  //     stagger: 0.5,
  //   });
  //   // });
  // }
  animateMenuItems() {
    this.menuItems.map(item => console.log(item.nativeElement))
    gsap.from(this.menuItems.map(item => item.nativeElement), {
      opacity: 0,
      x: 200,
      delay: 0.2,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  toggleTheme(): void {
    const nextTheme = this.commonService.selectedTheme === 'light' ? 'dark' : 'light';
    this.commonService.setTheme(nextTheme);
    // this.closeSidebar();
  }
}
