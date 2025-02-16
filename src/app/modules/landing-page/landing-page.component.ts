import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule, MatIconModule, FormsModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  scrollToDivId: string | null = '';
  sections: any[] = [];
  constructor(private route: ActivatedRoute, public commonService: CommonService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params && params.get("section")) {
        this.scrollToDivId = params.get("section");
        this.commonService.scrollToDiv(this.scrollToDivId);
      } else {
        this.commonService.scrollToTop();
      }
    });

    this.getSections();
  }

  private getSections() {
    this.apiService.getSectionWithPosts().subscribe((response: any) => {
      if (response.result && response.data && response.data.length > 0) {
        console.log(response);
        this.sections = response.data.sort((a: any, b: any) => a.order - b.order);
      } else {
        this.sections = [];
      }
    })
  }

  redirectTo(path: string, query: {}) {
    this.commonService.navigateToQueryParams(path, query);
  }
}
