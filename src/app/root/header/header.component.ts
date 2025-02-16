import { Component, Input } from '@angular/core';
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
  @Input() isScrolled: boolean = false;

  constructor(private router: Router, private commonService: CommonService) {}

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

}
