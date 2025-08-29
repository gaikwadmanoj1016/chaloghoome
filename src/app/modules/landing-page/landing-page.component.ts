import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { ApiService } from '../../shared/services/api.service';
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AboutUsComponent } from "../about-us/about-us.component";
import { FormsModule } from '@angular/forms';
import { slugify } from '../../utils/slugify';
import { Category } from '../../admin-panel/master-category-list/master-category-list.component';
import { Subscription } from 'rxjs';
import { NgClass, NgFor } from '@angular/common';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NgFor, NgClass, SharedModule, MatIconModule, RouterModule, CarouselModule, SharedModule, ContactUsComponent, AboutUsComponent, FormsModule, SearchBarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('counter') counters!: QueryList<ElementRef>;
  @ViewChild('myVideo', { static: true }) myVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;
  @ViewChild('heroContent', { static: false }) heroContent!: ElementRef;
  @ViewChildren('shape', { read: ElementRef }) shapes!: QueryList<ElementRef>;
  // @ViewChild('stars', { static: true }) stars!: ElementRef;

  placesData = [
    {
      state: "Maharashtra",
      places: [
        {
          name: "Gateway of India",
          image: "../../../assets/imgs/image-placeholder.jpg",
          description: "A historical monument overlooking the Arabian Sea in Mumbai."
        },
        {
          name: "Ajanta & Ellora Caves",
          image: "../../../assets/imgs/image-placeholder.jpg",
          description: "Ancient rock-cut caves with beautiful paintings and sculptures."
        }
      ]
    },
    {
      state: "Karnataka",
      places: [
        {
          name: "Mysore Palace",
          image: "../../../assets/imgs/image-placeholder.jpg",
          description: "A grand royal residence showcasing Indo-Saracenic architecture."
        },
        {
          name: "Hampi",
          image: "../../../assets/imgs/image-placeholder.jpg",
          description: "A UNESCO World Heritage Site with magnificent ruins and temples."
        }
      ]
    },
    {
      state: "Rajasthan",
      places: [
        {
          name: "Jaipur - Pink City",
          image: "../../../assets/imgs/image-placeholder.jpg",
          description: "Famous for its heritage sites, including Hawa Mahal and Amber Fort."
        },
        {
          name: "Jaisalmer Fort",
          image: "../../../assets/imgs/image-placeholder.jpg",
          description: "A golden sandstone fort located in the Thar Desert."
        }
      ]
    }
  ];
  scrollToDivId: string | null = '';
  sections: any[] = [];
  regionList: string[] = [];
  selectedRegionPlaces: any = {};
  videoLoaded = signal(false);
  videoError = signal(false);
  isScrolled = false;
  searchQuery: string = '';
  categories: Category[] = [];
  private routerSubscription!: Subscription;
  slugify = slugify;
  constructor(public commonService: CommonService, private apiService: ApiService, private router: Router) { }
  overlayVisible = false;
  clickedShapeIndex: number | null = null;

  expandedImage = '';

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.overlayVisible) {
      this.closeOverlay();
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 200;
  }
  ngOnInit(): void {
    this.mapIndiaSection();
    this.startShootingStars();
    if (this.commonService.sections && this.commonService.sections.length > 0) {
      this.sections = this.commonService.sections;
    } else {
      this.getSections();
    }
    this.getCategories();
    this.selectedRegionPlaces = this.placesData[0];
  }

  ngAfterViewInit(): void {
    const starContainer = document.querySelector('.stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      starContainer?.appendChild(star);
    }
    this.animateCounters();
    this.animateUsingGSap();
    // this.routerSubscription = this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     setTimeout(() => {
    //       this.animateUsingGSap(); // re-run when coming back
    //     }, 100); // delay to allow DOM rendering
    //   }
    // });
  }
  public getCategories() {
    this.apiService.getMasterCategoryList().subscribe((response: any) => {
      if (response.result) {
        this.categories = response.data;
      } else {
        this.categories = [];
      }
    })
  }

  private getSections() {
    // this.commonService.sections = [];
    this.apiService.getSectionWithPosts(7).subscribe((response: any) => {
      if (response.result && response.data && response.data.length > 0) {
        this.sections = response.data.sort((a: any, b: any) => a.order - b.order);
        this.commonService.sections = this.sections;
        // this.sections[1].posts.splice(2,6)
        this.commonService.places = [];
        if (this.sections && this.sections.length > 0) {
          localStorage.setItem('sections', JSON.stringify(this.sections));
          this.addSomeStaticContent();
          for (let section of this.sections) {
            for (let place of section.posts.content) {
              if (!this.commonService.places.includes(place.postName)) {
                this.commonService.places.push(place.postName);
              }
            }
          }
        }
      } else {
        this.sections = [];
      }
    })
  }

  public addSomeStaticContent() {
    for (let section of this.sections) {
      section.sectionId = slugify(section.sectionName, '-');
      if (section.posts.content && section.posts.content.length > 0) {
        section.posts.content.map((item: any) => {
          item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
          return item;
        });
        if ((section.sectionId === 'hidden-gems')) {
          // section.background = "linear-gradient(to right, rgba(0, 119, 182, 0.8), rgba(244, 162, 97, 0.8)), url('../../../assets/imgs/hidden-gems/faroe-islands-2.jpg') center/cover no-repeat";
          section.description = "Explore the world’s most breathtaking destinations, handpicked for adventurous travelers.";
          section.class = "section-new";
          // section.isBackgroundVideo = true;
          // section.backgroundVideoSource = "../../../assets/videos/253436_tiny.mp4";
        } else if (section.sectionId === 'wonders-of-the-world') {
          section.class = "galactic-wonders";
          section.description = "Embark on an adventure like never before! Discover hidden gems, breathtaking landscapes, and stories waiting to be told";
          // section.isBackgroundVideo = true;
          // section.backgroundVideoSource = "../../../assets/videos/wonders.mp4";
        } else {
          // section.background = "linear-gradient(to right, rgba(0, 119, 182, 0.8), rgba(244, 162, 97, 0.8)), url("+section.posts[0].imageUrl || section.posts[0].imageUrl+") center/cover no-repeat";
          section.description = "Explore breathtaking destinations, immerse yourself in cultures, and create memories that last a lifetime.";
          section.class = "adventure-section";
        }
      };
      // if (!this.commonService.sections.find(item => item.sectionId === section.sectionId)) {
      //   this.commonService.sections.push({
      //     sectionId: section.sectionId,
      //     sectionName: section.sectionName
      //   });
      // }
    }
  }
  mapIndiaSection() {
    this.regionList = this.placesData.map(item => item.state);
  }

  public selectRegion(region: string) {
    this.selectedRegionPlaces = this.placesData.find(item => item.state === region);
  }

  add3DEffect(event: any) {
    event.currentTarget.style.transform = "rotateY(10deg) rotateX(10deg) scale(1.05)";
  }

  remove3DEffect(event: any) {
    event.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  }

  public redirectTo(path: string) {
    this.commonService.navigateTo(path);
  }

  public navigateTo(section: any) {
    this.commonService.navigateTo('section/' + section.id);
  }

  animateCounters() {
    this.counters.forEach((counter: ElementRef) => {
      let count = 0;
      const target = Number(counter.nativeElement.getAttribute('data-count'));
      const increment = target / 100;

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.nativeElement.textContent = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.nativeElement.textContent = target;
        }
      };

      updateCount();
    });
  }

  animateUsingGSap() {
    // for hero section
    // this.heroAnimation();
    this.animateHeroSection();
    // this.aboutAnimation();
  }

  // * important gsap animatino for hero and about us
  // private heroAnimation() {
  //   const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" }, delay: 1.5 });

  //   tl.from(".hero-container .title-line", { y: 100, opacity: 0 })
  //     .from(".hero-container h2", { y: 100, opacity: 0 }, "-=0.5")
  //     .from(".hero-container p", { y: 100, opacity: 0 }, "-=0.5")
  //     .from(".hero-btn", { y: 100, opacity: 0 }, "-=0.5");
  // }

  // private aboutAnimation() {
  //   console.log("inside about section animation method");

  //   document.querySelectorAll(".section").forEach((section) => {
  //     console.log("current section which will animate ", section);

  //     const text = section.querySelector(".text");
  //     const image = section.querySelector(".image");
  //     const button = section.querySelector(".explore-about");

  //     const isImageOnRight = section.classList.contains("image-on-right");
  //     console.log(isImageOnRight, section.classList);

  //     if (text) {
  //       console.log("text");

  //       gsap.from(text.querySelectorAll("p"), {
  //         scrollTrigger: {
  //           trigger: section,
  //           start: "top 60%",
  //           toggleActions: "play none none reverse",
  //           markers: true
  //         },
  //         opacity: 0,
  //         x: isImageOnRight ? -100 : 100,
  //         duration: 0.6,
  //         ease: "power2.out",
  //         stagger: 0.2,
  //       });
  //       gsap.from(text.querySelectorAll("li"), {
  //         scrollTrigger: {
  //           trigger: section,
  //           start: "top 60%",
  //           toggleActions: "play none none reverse",
  //           markers: true
  //         },
  //         opacity: 0,
  //         x: isImageOnRight ? -100 : 100,
  //         duration: 0.6,
  //         ease: "power2.out",
  //         stagger: 0.2,
  //       });
  //     }

  //     gsap.from(image, {
  //       scrollTrigger: {
  //         trigger: section,
  //         start: "top 60%",
  //         toggleActions: "play none none reverse",
  //         markers: true
  //       },
  //       opacity: 0,
  //       x: isImageOnRight ? 100 : -100,
  //       duration: 1,
  //       ease: "power3.out",
  //     });

  //     if (button) {
  //       console.log("button");
  //       gsap.from(button, {
  //         scrollTrigger: {
  //           trigger: section,
  //           start: "top 55%",
  //           toggleActions: "play none none reverse",
  //           markers: true
  //         },
  //         opacity: 0,
  //         scale: 0.8,
  //         duration: 0.5,
  //         delay: 0.3,
  //         ease: "back.out(1.7)",
  //       });
  //     }
  //     console.log("end of about animation");

  //   });
  //   console.log("outside of about animation");
  // }
  animateHeroSection(): void {
    const tl = gsap.timeline();

    // Fade in the whole hero section
    tl.from(this.heroSection.nativeElement, {
      opacity: 0,
      duration: 0.5,
      ease: 'power1.out'
    });

    // Animate shapes with smooth scale and opacity
    tl.from(this.shapes.map(s => s.nativeElement), {
      scale: 0.6,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: 0.2
    }, '-=0.3');

    // Animate stars fade in
    // tl.from(this.stars.nativeElement, {
    //   opacity: 0,
    //   duration: 0.6,
    //   y: -20,
    //   ease: 'power2.out'
    // }, '-=0.4');

    // Animate hero content with staggered fade-in and slide-up
    const contentChildren = this.heroContent.nativeElement.children;
    tl.from(contentChildren, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1
    }, '-=0.4');
  }
  getStars(rating: number): number[] {
    return Array(5).fill(rating).map((_, i) => i);
  }

  customOptions: OwlOptions = {
    loop: true,
    margin: 30,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1024: {
        items: 3
      }
    }
  };

  playCarousel() {
    const el = document.querySelector('.owl-carousel');
    if (el) {
      (el as any).dispatchEvent(new CustomEvent('play.owl.autoplay', { detail: [1000] }));
    }
  }

  stopCarousel() {
    const el = document.querySelector('.owl-carousel');
    if (el) {
      (el as any).dispatchEvent(new CustomEvent('stop.owl.autoplay'));
    }
  }

  closeOverlay() {
    this.overlayVisible = false;

    // Animate shapes back in
    const shapes = document.querySelectorAll('.hero-shapes .shape');
    shapes.forEach((shape) => {
      (shape as HTMLElement).style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      (shape as HTMLElement).style.opacity = '1';
      (shape as HTMLElement).style.transform = 'translateY(0) scale(1)';
    });
  }

  onShapeClick(imageUrl: string) {
    this.expandedImage = imageUrl;
    this.overlayVisible = true;

    // Animate all shapes out
    const shapes = document.querySelectorAll('.hero-shapes .shape');
    shapes.forEach((shape, index) => {
      (shape as HTMLElement).style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      (shape as HTMLElement).style.opacity = '0';
      (shape as HTMLElement).style.transform = `translateY(${index % 2 === 0 ? '-200px' : '200px'}) scale(0.5)`;
    });
  }

  startShootingStars() {
    const container = document.querySelector('.shooting-stars');
    if (!container) return;

    setInterval(() => {
      const star = document.createElement('div');
      star.className = 'shooting-star';

      // Random trail type: short or long
      const isLongTrail = Math.random() > 0.5;
      const trailLength = isLongTrail ? 100 : 60;
      const duration = isLongTrail ? 1600 : 1000;

      // Random position and angle
      const startTop = Math.random() * window.innerHeight * 0.5;
      const startLeft = window.innerWidth + 100; // offscreen start
      const angle = 35 + Math.random() * 20; // 35° to 55°

      star.style.width = '2px';
      star.style.height = `${trailLength}px`;
      star.style.top = `${startTop}px`;
      star.style.left = `${startLeft}px`;
      star.style.transform = `rotate(${angle}deg)`;
      star.style.animationDuration = `${duration}ms`;

      container.appendChild(star);

      // Remove after animation
      setTimeout(() => {
        star.remove();
      }, duration);
    }, 2500); // star frequency
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
