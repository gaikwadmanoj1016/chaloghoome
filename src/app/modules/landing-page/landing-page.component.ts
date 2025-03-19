import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule, MatIconModule, FormsModule, RouterModule, NgClass, SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  // @ViewChild('.section2', { static: true }) section!: ElementRef;
  // @ViewChild('.head h2', { static: true }) heading!: ElementRef;
  // @ViewChild('.see-all-btn', { static: true }) seeAllBtn!: ElementRef;
  // @ViewChildren('app-place-card') cards!: QueryList<ElementRef>;

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
  ngAfterViewInit() {
    // const timeline = gsap.timeline({ delay: 0.3 });

    // timeline
    //   .to(this.section.nativeElement, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    //   .to(this.heading.nativeElement, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, "-=0.8")
    //   .to(this.seeAllBtn.nativeElement, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.6")
    //   .to(this.cards.toArray(), { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power2.out' }, "-=0.4");
  }

  private getSections() {
    this.apiService.getSectionWithPosts().subscribe((response: any) => {
      if (response.result && response.data && response.data.length > 0) {
        this.sections = response.data.sort((a: any, b: any) => a.order - b.order);
        if (this.sections && this.sections.length > 0) {
          for (let section of this.sections) {
            section.sectionId = section.sectionName.toLowerCase().split(' ').join('_');
            if (section.posts && section.posts.length > 0) {
              section.posts.map((item: any) => {
                item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
                return item;
              })
            }
          }
        }
        console.log(this.sections);
      } else {
        this.sections = [];
      }
    })
  }

  // redirectWithParams(path: string, query: {}) {
  //   this.commonService.navigateToQueryParams(path, query);
  // }

  public redirectTo(path: string) {
    this.commonService.navigateTo(path);
  }

  public navigateTo(section: any) {
    this.commonService.navigateTo('section-detail/' + section.id);
  }
}
