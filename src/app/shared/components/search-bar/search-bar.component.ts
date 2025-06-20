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
  @Input() customClass: string = '';
  @Input() isScrolled: boolean = false;
  @Input() defaultExpanded: boolean = false;
  @Input() suggestionsOpening: 'up' | 'down' = 'down';
  @ViewChild('searchInput') searchInput!: ElementRef;

  suggestionsFetched = signal(false);
  // searchQuery = '';
  searchResults: any[] = [];
  private socket!: WebSocket;
  isSocketConnected: boolean = false;
  staticPlaces: any[] = [];
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

  readonly HISTORY_KEY = 'userSearchHistory';
  maxHistoryItems = 10; // Optional: limit history size
  pendingQuery: string = '';

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

  onSearchFocus() {
    this.connectWebsocket();

    // If there's already a query, re-trigger input change manually
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.onInputChange();
    }
  }

  connectWebsocket() {
    this.showSuggestions = true;
    // this.staticPlaces = this.commonService.places;
    this.fetchStaticPlaceList();
    this.suggestionsFetched.set(true);
    if (!this.isSocketConnected) {
      // this.socket = new WebSocket("wss://api.chaloghoome.com/adminService/ws/search");
      this.socket = new WebSocket(environment.webSocketUrl + "ws/search");

      this.socket.onopen = () => {
        console.log("✅ WebSocket connected");
        this.isSocketConnected = true;
        // Send pending query if available
        if (this.pendingQuery && this.pendingQuery.length > 2) {
          this.socket.send(this.pendingQuery);
          this.pendingQuery = '';
        }
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.isSocketConnected = false;
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const grouped = data.reduce((acc: any, item: any) => {
          const section = item.section || 'Other';
          if (!acc[section]) acc[section] = [];
          acc[section].push(item);
          return acc;
        }, {} as Record<string, any[]>);

        const updatedSuggestions = Object.keys(grouped).map(key => ({
          label: key,
          list: grouped[key]
        }));

        // Show skeleton for 1 more second before updating
        setTimeout(() => {
          this.filteredSuggestions = updatedSuggestions;
          this.suggestionsFetched.set(true); // ✅ show real content
        }, 500); // 500 ms = 0.5 second
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

  // onInputChange() {
  //   const query = this.searchQuery.toLowerCase().trim();
  //   const trimmed = query.trim();

  //   if (trimmed.length > 2 && this.socket.readyState === WebSocket.OPEN) {
  //     console.log("📤 Sending to WebSocket:", trimmed);
  //     this.socket.send(trimmed);
  //   } else if (trimmed.length <= 2) {
  //     this.staticPlaces = this.commonService.places.filter(
  //       place => place.toLowerCase().includes(query)
  //     );
  //   }

  // }
  // onInputChange() {
  //   const query = this.searchQuery.toLowerCase().trim();
  //   const trimmed = query.trim();

  //   this.suggestionsFetched.set(false); // reset

  //   if (trimmed.length > 2 && this.socket.readyState === WebSocket.OPEN) {
  //     this.socket.send(trimmed);
  //   } else if (trimmed.length <= 2) {
  //     this.staticPlaces = this.commonService.places.filter(
  //       place => place.toLowerCase().includes(query)
  //     );
  //   }
  // }
  onInputChange() {
    const query = this.searchQuery.toLowerCase().trim();
    const trimmed = query.trim();
    this.suggestionsFetched.set(false);
    if (trimmed.length > 2 && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(trimmed);
    } else if (trimmed.length <= 2) {
      this.fetchStaticPlaceList();
      this.suggestionsFetched.set(true);
    } else {
      // Socket not ready: store for later
      this.pendingQuery = query;
    }
  }

  private fetchStaticPlaceList() {
    // ✅ Fetch recent history
    const history = this.getSearchHistory();

    // ✅ Static popular places (most searched)
    const popular = this.commonService.places;

    // ✅ Build combined list for UI
    this.staticPlaces = [];

    if (history.length > 0) {
      this.staticPlaces.push({
        label: 'Recent',
        list: history.map(h => ({ postName: h }))
      });
    }

    if (popular.length > 0) {
      this.staticPlaces.push({
        label: 'Most Searched',
        list: popular.map(p => ({ postName: p }))
      });
    }

  }

  onSearch(): void {
    if (this.searchQuery) {
      this.saveToHistory(this.searchQuery); // ✅ Save to localStorage
      this.commonService.navigateTo('/search/' + this.searchQuery);
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.saveToHistory(suggestion); // ✅ Save to localStorage
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


  // user history 

  saveToHistory(query: string) {
    if (!query) return;

    const history = this.getSearchHistory();
    const updatedHistory = [query, ...history.filter(q => q !== query)];

    if (updatedHistory.length > this.maxHistoryItems) {
      updatedHistory.splice(this.maxHistoryItems); // Trim to limit
    }

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
  }

  getSearchHistory(): string[] {
    const stored = localStorage.getItem(this.HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  clearHistory() {
    localStorage.removeItem(this.HISTORY_KEY);
  }

}
