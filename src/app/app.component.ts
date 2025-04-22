import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { ApiService } from './services/api.service';
import { CommonService } from './services/common.service';
import { HeaderComponent } from './root/header/header.component';
import { FooterComponent } from './root/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { slugify } from './utils/slugify';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UserInterface {
  id: number,
  name: string,
  role: string
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, CarouselModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
// export class AppComponent implements AfterViewInit {
//   @ViewChild('box', { static: false }) box!: ElementRef;
//   @ViewChild('string', { static: false }) string!: ElementRef;
//   @ViewChild('path', { static: false }) path!: ElementRef;

//   intialPath = "M 10 100 Q 250 100 490 100";
//   finalPath = "M 10 100 Q 250 100 490 100";
//   y: any;
//   x: any;

//   ngAfterViewInit() {
//     gsap.registerPlugin(ScrollTrigger);

//     // gsap.to(this.box.nativeElement, {
//     //   x: 300, // Moves the box to the right
//     //   duration: 1,
//     //   ease: 'power2.out',
//     //   rotate: 360,
//     //   borderRadius: "100%",
//     //   scrollTrigger: {
//     //     trigger: this.box.nativeElement,
//     //     start: 'top 50%',  // Animation starts when the box enters 80% of the viewport
//     //     end: 'top 35%',    // Ends at 30% of the viewport
//     //     scrub: true,       // Smooth animation with scroll
//     //     markers: true      // Show start & end markers (Remove in production)
//     //   }
//     // });

//   }
//   public onMouseMove(event: any) {
//     this.y = event.y;
//     this.x = event.x;
//     this.finalPath = `M 10 100 Q ${this.x} ${this.y} 490 100`;
//     gsap.to(this.path.nativeElement, {
//       attr: { d: this.finalPath }
//     })
//   }
//   public onMouseLeave(event: any) {
//     gsap.to(this.path.nativeElement, {
//       attr: { d: this.intialPath },
//       duration: 1.2,
//       ease: "elastic.out(1,0.3)",
//       // duration: 1.5,
//       // ease: "elastic.out(1,5.2)"
//     })
//   }
// }
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
  constructor(public commonService: CommonService, private apiService: ApiService) { }
  // cards = Array.from({ length: 6 }, (_, i) => ({
  //   title: `Card ${i + 1}`,
  //   content: `Content for card ${i + 1}`
  // }));

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 200;
  }
  ngOnInit(): void {
    this.getSectionList();
  }

  private getSectionList() {
    this.apiService.getSectionsAndPostList().subscribe((response: any) => {
      if (response.result) {
        response.data.sort((a: any, b: any) => a.order - b.order);
        this.commonService.sections = response.data.map((item: any) => {
          item.sectionId = slugify(item.sectionName, '-');
          return item;
        });
        console.log(response.data);
        localStorage.setItem('sections', JSON.stringify(this.commonService.sections));
      } else {
        console.error(response.message || "something went wrong");
      }
    })
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
