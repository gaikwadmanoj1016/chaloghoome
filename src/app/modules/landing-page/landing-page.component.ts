import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ContactUsComponent } from "../contact-us/contact-us.component";
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AboutUsComponent } from "../about-us/about-us.component";
import { FormsModule } from '@angular/forms';
import { slugify } from '../../utils/slugify';
import { Category } from '../admin-panel/master-category-list/master-category-list.component';
import { Subscription } from 'rxjs';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SharedModule, MatIconModule, RouterModule, CarouselModule, SharedModule, ContactUsComponent, AboutUsComponent, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('counter') counters!: QueryList<ElementRef>;
  @ViewChild('myVideo', { static: true }) myVideoRef!: ElementRef<HTMLVideoElement>;

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
  // planets = [
  //   {
  //     id: 1,
  //     name: "Neptune",
  //     description: "A deep blue gas giant with supersonic winds.",
  //     image: "https://media.istockphoto.com/id/145569757/photo/planet-neptune-elements-of-this-image-furnished-by-nasa.jpg?s=1024x1024&w=is&k=20&c=0xlRIr86LuWOqqM89v4690oAVe3yBbrtCRq-Nq5Pvd8="
  //   },
  //   {
  //     id: 2,
  //     name: "Mars",
  //     description: "The Red Planet, home to the tallest volcano in the solar system.",
  //     image: "https://media.istockphoto.com/id/1214890390/photo/planet-mars-in-space.jpg?s=1024x1024&w=is&k=20&c=PLK0sLUiON73M-3KOwfhD56UCmR1W2AAgMTTSUx0oF4="
  //   },
  //   {
  //     id: 3,
  //     name: "Saturn",
  //     description: "Famous for its stunning rings and numerous moons.",
  //     image: "https://media.istockphoto.com/id/482675385/photo/saturn-with-stars-in-the-background.jpg?s=1024x1024&w=is&k=20&c=-ERAWSJeLP2fUHQvGJvDaSJmx3IJrpbOpQa3uSPgclM="
  //   },
  //   {
  //     id: 4,
  //     name: "Jupiter",
  //     description: "The largest planet, with a massive storm known as the Great Red Spot.",
  //     image: "https://media.istockphoto.com/id/173228030/photo/jupiter-on-star-field.jpg?s=1024x1024&w=is&k=20&c=EUvp1jTz6X9lAF9Sz7UcW7LhFU2JY2--ltXjJqo_GS8="
  //   },
  //   {
  //     id: 5,
  //     name: "Venus",
  //     description: "A scorching world with a thick, toxic atmosphere.",
  //     image: "https://media.istockphoto.com/id/1199281415/photo/planet-venus.jpg?s=1024x1024&w=is&k=20&c=9BrGdPKpn5H-uMPBoHSFZ6JiO82txcLv5CpQODx_JHY="
  //   },
  //   {
  //     id: 6,
  //     name: "Mercury",
  //     description: "The smallest planet, closest to the Sun, with extreme temperature changes.",
  //     image: "https://media.istockphoto.com/id/524287351/photo/mercury.jpg?s=1024x1024&w=is&k=20&c=B_iBIp5s9UB7UmWjlzG50v9FehMXk2h-ZNT_k_LlxOs="
  //   },
  //   {
  //     id: 7,
  //     name: "Uranus",
  //     description: "An icy giant that rotates on its side.",
  //     image: "https://media.istockphoto.com/id/1199283538/photo/planet-uranus.jpg?s=1024x1024&w=is&k=20&c=w7aXUMVg_cv8k66xZFjaHuVrlL6bVfHcxgSRIC4RH9Q="
  //   },
  //   {
  //     id: 8,
  //     name: "Earth",
  //     description: "The only known planet to support life.",
  //     // image: "https://media.istockphoto.com/id/1314000171/video/earth-rotation-loopable.mp4?s=mp4-640x640-is&k=20&c=wI4rNMfqQ2k4OfeQddU4bkX-EKzCVW_kr0clHhrbiQ4="
  //     image: "https://media.istockphoto.com/id/1457206081/photo/earth-planet-at-night-into-the-dark-cities-light-earth-in-deep-space-with-stars-planet-sphere.jpg?s=612x612&w=is&k=20&c=hZng_mgVgLLmPxVQIWnCZxn_sApfa88h-rResmvSL4o="
  //   }
  // ];
  videoLoaded = signal(false);
  videoError = signal(false);
  isScrolled = false;
  searchQuery: string = '';
  categories: Category[] = [];
  private routerSubscription!: Subscription;
  slugify = slugify;
  constructor(public commonService: CommonService, private apiService: ApiService, private router: Router) { }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 200;
  }
  ngOnInit(): void {
    this.mapIndiaSection();
    if (this.commonService.sections && this.commonService.sections.length > 0) {
      this.sections = this.commonService.sections;
    } else {
      this.getSections();
    }
    this.getCategories();
    this.selectedRegionPlaces = this.placesData[0];
  }

  ngAfterViewInit() {
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
          section.isBackgroundVideo = true;
          section.backgroundVideoSource = "../../../assets/videos/253436_tiny.mp4";
        } else if (section.sectionId === 'wonders-of-the-world') {
          section.class = "galactic-wonders";
          section.description = "Embark on an adventure like never before! Discover hidden gems, breathtaking landscapes, and stories waiting to be told";
          section.isBackgroundVideo = true;
          section.backgroundVideoSource = "../../../assets/videos/wonders.mp4";
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
    this.heroAnimation();
    // this.aboutAnimation();
  }

  private heroAnimation() {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" }, delay: 1.5 });

    tl.from(".hero-container .title-line", { y: 100, opacity: 0 })
      .from(".hero-container h2", { y: 100, opacity: 0 }, "-=0.5")
      .from(".hero-container p", { y: 100, opacity: 0 }, "-=0.5")
      .from(".hero-btn", { y: 100, opacity: 0 }, "-=0.5");

    // gsap.to(".hero-section", {
    //   scale: 0.8,
    //   top: 0,
    //   borderRadius: 100,
    //   // opacity: 0,
    //   scrollTrigger: {
    //     trigger: ".hero-section",
    //     start: "top top",
    //     end: "bottom -30%",
    //     scrub: 2,
    //     pin: true,
    //   }
    // });
  }

  private aboutAnimation() {
    console.log("inside about section animation method");

    document.querySelectorAll(".section").forEach((section) => {
      console.log("current section which will animate ", section);

      const text = section.querySelector(".text");
      const image = section.querySelector(".image");
      const button = section.querySelector(".explore-about");

      const isImageOnRight = section.classList.contains("image-on-right");
      console.log(isImageOnRight, section.classList);

      if (text) {
        console.log("text");

        gsap.from(text.querySelectorAll("p"), {
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
            markers: true
          },
          opacity: 0,
          x: isImageOnRight ? -100 : 100,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.2,
        });
        gsap.from(text.querySelectorAll("li"), {
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
            markers: true
          },
          opacity: 0,
          x: isImageOnRight ? -100 : 100,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.2,
        });
      }

      gsap.from(image, {
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          toggleActions: "play none none reverse",
          markers: true
        },
        opacity: 0,
        x: isImageOnRight ? 100 : -100,
        duration: 1,
        ease: "power3.out",
      });

      if (button) {
        console.log("button");
        gsap.from(button, {
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
            markers: true
          },
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          delay: 0.3,
          ease: "back.out(1.7)",
        });
      }
      console.log("end of about animation");

    });
    console.log("outside of about animation");
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

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
