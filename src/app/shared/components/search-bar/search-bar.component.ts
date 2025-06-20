import { Component, ElementRef, HostListener, Input, OnInit, signal, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { environment } from '../../../../../environment.prod';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SharedModule, FormsModule, NgIf],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  @Input() isScrolled: boolean = false;
  @Input() defaultExpanded: boolean = false;
  @Input() suggestionsOpening: 'up' | 'down' = 'down';
  @ViewChild('searchInput') searchInput!: ElementRef;

  suggestionsFetched = signal(false);
  // searchQuery = '';
  searchResults: any[] = [];
  private socket!: WebSocket;
  isSocketConnected: boolean = false;
  staticPlaces: string[] = [];
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
  constructor(public commonService: CommonService) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault(); // prevent browser's default find functionality
      this.focusSearch();
    }
  }

  ngOnInit(): void {
    this.isExpanded.set(this.defaultExpanded);
    this.commonService.searchedQueryString.subscribe((query: string) => {
      if (query) {
        this.searchQuery = query;
      } else {
        this.searchQuery = '';
      }
    })
  }


  connectWebsocket() {
    this.showSuggestions = true;
    this.staticPlaces = this.commonService.places;
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


  onInputChange() {
    const query = this.searchQuery.toLowerCase().trim();
    const trimmed = query.trim();

    if (trimmed.length > 2 && this.socket.readyState === WebSocket.OPEN) {
      console.log("📤 Sending to WebSocket:", trimmed);
      this.socket.send(trimmed);
    } else if (trimmed.length <= 2) {
      this.staticPlaces = this.commonService.places.filter(
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
      this.showSuggestions = false;
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
    this.searchQuery = '';
  }

}
