import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, QueryList, Renderer2, signal, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { convertSlugToNormal } from '../../utils/slugify';
import gsap from 'gsap';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  // @ViewChild('nav') nav: 
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('navbar', { static: false }) nav!: ElementRef;
  @Input() isScrolled: boolean = false;
  @Input() sections: any[] = [];
  isMobileView: boolean = false;
  searchQuery: string = '';
  showSuggestions = false;
  isExpanded = signal(false);
  filteredSuggestions: any = [];
  // Sample list, you can fetch from backend too
  allSuggestions: any = [
    {
      label: 'Most Seached',
      data: [
        'Taj Mahal',
        'Eiffel Tower',
        'Sydney Opera House',
        'Great Wall of China',
        'Stonehenge',
        'Machu Picchu'
      ]
    }
  ];
  apiCallCount: number = 0;
  suggestionsFetched = signal(false);
  // searchQuery = '';
  searchResults: any[] = [];
  private socket!: WebSocket;
  isSocketConnected: boolean = false;


  constructor(private router: Router, public commonService: CommonService, private apiService: ApiService) {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault(); // prevent browser's default find functionality
      this.focusSearch();
    }
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
  }


  ngAfterViewInit() {
    this.checkScreenSize();
    // Wait for sidebar to open
    if (this.commonService.isSidebarOpen()) {
      this.animateMenuItems();
    }
  }

  connectWebsocket() {
    if (!this.isSocketConnected) {

      // this.socket = new WebSocket("wss://api.chaloghoome.com/adminService/ws/search");
      this.socket = new WebSocket(environment.webSocketUrl + "ws/search");

      this.socket.onopen = () => {
        console.log("✅ WebSocket connected");
        this.isSocketConnected = true;
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.isSocketConnected = false;
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Call a function to update your UI with `data`
        console.log(data);
        // Example: 'data' is the array of post objects received from WebSocket
        const grouped = data.reduce((acc: any, item: any) => {
          const section = item.section || 'Other';

          if (!acc[section]) {
            acc[section] = [];
          }

          acc[section].push(item);
          return acc;
        }, {} as Record<string, any[]>);

        // Convert to array of groups (if needed)
        this.filteredSuggestions = Object.keys(grouped).map(key => ({
          label: key,
          list: grouped[key]
        }));
        console.log(this.filteredSuggestions);
      };
    }
  }

  disconnectWebsocket() {
    if (this.isSocketConnected) {
      this.socket.close();
      console.log("✅ WebSocket connection closed");
      this.isSocketConnected = false;
    }
  }

  focusSearch() {
    this.searchInput?.nativeElement?.focus();
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

  onInputChange() {
    const query = this.searchQuery.toLowerCase().trim();
    const trimmed = query.trim();

    if (trimmed.length > 2 && this.socket.readyState === WebSocket.OPEN) {
      console.log("📤 Sending to WebSocket:", trimmed);
      this.socket.send(trimmed);
    } else if (trimmed.length <= 2) {
      this.filteredSuggestions = this.commonService.places.filter(
        place => place.toLowerCase().includes(query)
      );
    }

    // if (query.length > 0) {
    //   if (this.suggestionsFetched()) {
    //     this.filteredSuggestions = this.filterData(query);
    //     console.log(this.filteredSuggestions);
    //   } else {
    //     this.filteredSuggestions = this.commonService.places.filter(
    //       place => place.toLowerCase().includes(query)
    //     );
    //     if (this.apiCallCount === 0) {
    //       this.getAllSuggestions(query);
    //     }
    //   }
    //   this.showSuggestions = true;
    // } else {
    //   this.filteredSuggestions = [];
    //   this.showSuggestions = false;
    // }
  }

  // private getAllSuggestions(query: string) {
  //   this.apiCallCount++;
  //   this.apiService.getAllSugestions().subscribe((response: any) => {
  //     if (response.result) {
  //       this.allSuggestions = [];

  //       if (response.data && Object.keys(response.data).length > 0) {
  //         const existingLabels = new Set();

  //         for (let key in response.data) {
  //           const label = convertSlugToNormal(key); // e.g. "categories" → "Categories"

  //           if (!existingLabels.has(label)) {
  //             this.allSuggestions.push({
  //               label: label,
  //               list: response.data[key]
  //             });

  //             existingLabels.add(label); // Mark as added
  //           } else {
  //             console.warn(`Duplicate label skipped: ${label}`);
  //           }
  //         }

  //         // this.suggestionsFetched.set(true);
  //         // this.filteredSuggestions = this.filterData(query);
  //       }

  //       console.log(this.allSuggestions);
  //     } else {

  //     }
  //   })
  // }

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
}
