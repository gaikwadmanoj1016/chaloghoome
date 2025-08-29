import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2, signal } from '@angular/core';
import { ApiService } from './shared/services/api.service';
import { CommonService } from './shared/services/common.service';
import { HeaderComponent } from './root/header/header.component';
import { FooterComponent } from './root/footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, Event as RouterEvent, RouterOutlet } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FCMService } from './shared/services/fcm.service';

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
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  isScrolled = false;
  title = 'chalo-ghoome-blogs';
  users = signal<UserInterface[]>([
    { id: 1, name: 'Manoj', role: 'Admin' },
    { id: 2, name: 'Vipul', role: 'Develop' },
    { id: 3, name: 'Manoj G', role: 'Super Admin' },
  ]);

  user = this.users()[1];
  profileModal: boolean = false;

  constructor(private fcmService: FCMService, private http: HttpClient, public commonService: CommonService, private router: Router, private apiService: ApiService, private route: ActivatedRoute, private renderer: Renderer2) {
    this.fcmService.requestPermission();
  }
  // cards = Array.from({ length: 6 }, (_, i) => ({
  //   title: `Card ${i + 1}`,
  //   content: `Content for card ${i + 1}`
  // }));

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 200;
    // if (this.isScrolled) {
    //   document.documentElement.style.setProperty('--header-height', '70px');
    // } else {
    //   document.documentElement.style.setProperty('--header-height', '90px');
    // }
  }
  ngOnInit(): void {
    // this.getSectionList();
    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // 🔥 Logic here - runs every time route changes
        console.log('Route changed to:', event.urlAfterRedirects);
        this.commonService.currentRoute = event.urlAfterRedirects;
        this.commonService.routeChanged.next(event);
      });
    this.route.params.subscribe((param) => {
      console.log(param);
    })
    this.getSections();
  }

  ngAfterViewInit(): void {
    let theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') {
      this.commonService.setTheme(theme, this.renderer);
    } else {
      this.commonService.setTheme(this.commonService.selectedTheme, this.renderer);
    }
    setTimeout(() => {
      this.fcmService.requestPermission();
    }, 5000);
  }

  // notify(): void {
  //   this.pushService.showNotification(
  //     'Hello from Angular!',
  //     'This is a simple push notification.'
  //   );
  // }
  // subscribe() {
  //   console.log("subscription clicked");

  //   this.pushService.subscribeToNotifications();
  // }
  subscribeToPush() {
    Notification.requestPermission().then(async permission => {
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array("BO-bvsunEvQemRnWCruaWdPcLOHqK2njvBc9MHniSOXn35bKjeqigmzjNPtMfA0wSHa3pcu5RD-riv_enwjiKAY")
        });
        this.http.post('http://localhost:8080/api/subscribe', sub).subscribe(() => {
          console.log("Subscription sent to server.");
        });
      }
    });
  }

  urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    return new Uint8Array([...raw].map(char => char.charCodeAt(0)));
  }

  private getSections() {
    // this.commonService.sections = [];
    this.apiService.getSectionWithPosts(7).subscribe((response: any) => {
      if (response.result && response.data && response.data.length > 0) {
        this.commonService.sections = response.data.sort((a: any, b: any) => a.order - b.order);
        // this.sections[1].posts.splice(2,6)
        this.commonService.places = [];
        if (this.commonService.sections && this.commonService.sections.length > 0) {
          localStorage.setItem('sections', JSON.stringify(this.commonService.sections));
          // this.addSomeStaticContent();
          for (let section of this.commonService.sections) {
            for (let place of section.posts.content) {
              if (!this.commonService.places.includes(place.postName)) {
                this.commonService.places.push(place.postName);
              }
            }
          }
        }
        this.commonService.subscribeSectionsData.next(true);
      } else {
        this.commonService.subscribeSectionsData.next(false);
        this.commonService.sections = [];
      }
    })
  }
  // private getSectionList() {
  //   this.apiService.getSectionsAndPostList().subscribe((response: any) => {
  //     if (response.result) {
  //       response.data.sort((a: any, b: any) => a.order - b.order);
  //       this.commonService.sections = response.data.map((item: any) => {
  //         item.sectionId = slugify(item.sectionName, '-');
  //         return item;
  //       });
  //       console.log(response.data);
  //       localStorage.setItem('sections', JSON.stringify(this.commonService.sections));
  //     } else {
  //       console.error(response.message || "something went wrong");
  //     }
  //   })
  // }
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
