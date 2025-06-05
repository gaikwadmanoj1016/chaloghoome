import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() sections: any[] = [];

  constructor(public commonService: CommonService, private router: Router) { }

  scrollTo(sectionId: string) {
    this.commonService.scrollToDiv(sectionId);
  }

  showFooter(): boolean {
    const currentRoute = this.router.url;
    return !currentRoute.includes('login') && !currentRoute.includes('register');
  }
}
