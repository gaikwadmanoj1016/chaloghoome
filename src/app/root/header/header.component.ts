import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  // @ViewChild('nav') nav: 
  @ViewChild('navbar', { static: false }) nav!: ElementRef;
  @Input() isScrolled: boolean = false;
  @Input() sections: any[] = [];
  isMobileView: boolean = false;
  searchQuery: string = '';
  showSuggestions = false;
  isExpanded = signal(false);

  constructor(private router: Router, public commonService: CommonService, private route: ActivatedRoute) {
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.commonService.searchedQueryString.subscribe((query: string) => {
      if (query) {
        this.searchQuery = query;
      } else {
        this.searchQuery = '';
      }
    })
    // this.searchQuery = this.route.snapshot.queryParamMap.get('query') || '';
    // this.route.params.subscribe(params => {
    //   this.searchQuery = params['query'] ?? '';
    // });
  }

  ngAfterViewInit() {
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

  toggleSidebar(event: Event) {
    event.preventDefault(); // prevent link navigation
    this.commonService.isSidebarOpen.set(!this.commonService.isSidebarOpen());
  }

  closeSidebar() {
    this.commonService.isSidebarOpen.set(false);
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  // Sample list, you can fetch from backend too
  allSuggestions: string[] = [
    'Taj Mahal',
    'Eiffel Tower',
    'Sydney Opera House',
    'Great Wall of China',
    'Stonehenge',
    'Machu Picchu'
  ];

  filteredSuggestions: string[] = [];

  onInputChange() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query.length > 0) {
      this.filteredSuggestions = this.commonService.places.filter(
        place => place.toLowerCase().includes(query)
      );
      this.showSuggestions = true;
    } else {
      this.filteredSuggestions = [];
      this.showSuggestions = false;
    }
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.commonService.navigateTo('/search/' + this.searchQuery);
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch(); // Optional: auto-submit
  }

  hideSuggestionsWithDelay() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); // Timeout so it doesn't hide before click
  }

  public expandSearchBar() {
    this.isExpanded.set(true);
  }
  public collapseSearchBar() {
    this.isExpanded.set(false);
  }
}
