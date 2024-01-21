import { Component, HostListener, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonService } from './services/common.service';

interface UserInterface {
  id: number,
  name: string,
  role: string
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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
  constructor(private router: Router, private commonService: CommonService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  ngOnInit(): void {

  }

  showNav(): boolean {
    const currentRoute = this.router.url;
    return !currentRoute.includes('login') && !currentRoute.includes('register');
  }

  openProfile() {
    this.profileModal = !this.profileModal;
  }

  redirectTo(path: string) {
    this.commonService.navigateTo(path);
    this.profileModal = false;
  }

  ngOnDestroy(): void {
  }
}
