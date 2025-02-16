import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CommonService } from './services/common.service';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './root/header/header.component';
import { FooterComponent } from './root/footer/footer.component';

interface UserInterface {
  id: number,
  name: string,
  role: string
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  isScrolled = false;
  title = 'chalo-ghoome-blogs';
  users = signal<UserInterface[]>([
    { id: 1, name: 'Manoj', role: 'Admin' },
    { id: 2, name: 'Vipul', role: 'Develop' },
    { id: 3, name: 'Manoj G', role: 'Super Admin' },
  ]);

  user = this.users()[1];
  profileModal: boolean = false;
  constructor(private commonService: CommonService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  ngOnInit(): void {
    
  }

  public scrollTo(path: string) {
    this.commonService.navigateToQueryParams('home', { section: path })
  }
  public navigateTo(path: string) {
    if (path === 'hidden_gems' || path === 'wonders_of_world' || path === 'most_visited_places') {
      this.commonService.navigateToQueryParams('home', { section: path })
    } else {
      this.commonService.navigateTo(path);
    }
  }

  toggleProfileMenu() {
    this.profileModal = !this.profileModal;
  }
  closeProfileMenu() {
    this.profileModal = false;
  }

  redirectTo(path: string) {
    this.commonService.navigateTo(path);
    this.profileModal = false;
  }

  ngOnDestroy(): void {
  }
}
