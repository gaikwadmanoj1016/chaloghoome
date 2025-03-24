import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule, MatIconModule, FormsModule, RouterModule, NgClass, NgFor, SharedModule],
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
  planets = [
    {
      id: 1,
      name: "Neptune",
      description: "A deep blue gas giant with supersonic winds.",
      image: "https://media.istockphoto.com/id/175569757/photo/planet-neptune-elements-of-this-image-furnished-by-nasa.jpg?s=1024x1024&w=is&k=20&c=0xlRIr86LuWOqqM89v4690oAVe3yBbrtCRq-Nq5Pvd8="
    },
    {
      id: 2,
      name: "Mars",
      description: "The Red Planet, home to the tallest volcano in the solar system.",
      image: "https://media.istockphoto.com/id/1214890390/photo/planet-mars-in-space.jpg?s=1024x1024&w=is&k=20&c=PLK0sLUiON73M-3KOwfhD56UCmR1W2AAgMTTSUx0oF4="
    },
    {
      id: 3,
      name: "Saturn",
      description: "Famous for its stunning rings and numerous moons.",
      image: "https://media.istockphoto.com/id/482675385/photo/saturn-with-stars-in-the-background.jpg?s=1024x1024&w=is&k=20&c=-ERAWSJeLP2fUHQvGJvDaSJmx3IJrpbOpQa3uSPgclM="
    },
    {
      id: 4,
      name: "Jupiter",
      description: "The largest planet, with a massive storm known as the Great Red Spot.",
      image: "https://media.istockphoto.com/id/173228030/photo/jupiter-on-star-field.jpg?s=1024x1024&w=is&k=20&c=EUvp1jTz6X9lAF9Sz7UcW7LhFU2JY2--ltXjJqo_GS8="
    },
    {
      id: 5,
      name: "Venus",
      description: "A scorching world with a thick, toxic atmosphere.",
      image: "https://media.istockphoto.com/id/1199281415/photo/planet-venus.jpg?s=1024x1024&w=is&k=20&c=9BrGdPKpn5H-uMPBoHSFZ6JiO82txcLv5CpQODx_JHY="
    },
    {
      id: 6,
      name: "Mercury",
      description: "The smallest planet, closest to the Sun, with extreme temperature changes.",
      image: "https://media.istockphoto.com/id/524287351/photo/mercury.jpg?s=1024x1024&w=is&k=20&c=B_iBIp5s9UB7UmWjlzG50v9FehMXk2h-ZNT_k_LlxOs="
    },
    {
      id: 7,
      name: "Uranus",
      description: "An icy giant that rotates on its side.",
      image: "https://media.istockphoto.com/id/1199283538/photo/planet-uranus.jpg?s=1024x1024&w=is&k=20&c=w7aXUMVg_cv8k66xZFjaHuVrlL6bVfHcxgSRIC4RH9Q="
    },
    {
      id: 8,
      name: "Earth",
      description: "The only known planet to support life.",
      // image: "https://media.istockphoto.com/id/1314000171/video/earth-rotation-loopable.mp4?s=mp4-640x640-is&k=20&c=wI4rNMfqQ2k4OfeQddU4bkX-EKzCVW_kr0clHhrbiQ4="
      image: "https://media.istockphoto.com/id/1457206081/photo/earth-planet-at-night-into-the-dark-cities-light-earth-in-deep-space-with-stars-planet-sphere.jpg?s=612x612&w=is&k=20&c=hZng_mgVgLLmPxVQIWnCZxn_sApfa88h-rResmvSL4o="
    }
  ];

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
    this.commonService.sections = [];
    this.apiService.getSectionWithPosts().subscribe((response: any) => {
      if (response.result && response.data && response.data.length > 0) {
        this.sections = response.data.sort((a: any, b: any) => a.order - b.order);
        // this.sections[1].posts.splice(2,6)
        if (this.sections && this.sections.length > 0) {
          this.addSomeStaticContent();
        }
        console.log(this.sections);
      } else {
        this.sections = [];
      }
    })
  }
  
  public addSomeStaticContent() {
    for (let section of this.sections) {
      section.sectionId = section.sectionName.toLowerCase().split(' ').join('_');
      if (section.posts && section.posts.length > 0) {
        section.posts.map((item: any) => {
          item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
          return item;
        });
        if ((section.sectionId === 'hidden_gems')) {
          section.background = "linear-gradient(to right, rgba(0, 119, 182, 0.8), rgba(244, 162, 97, 0.8)), url('../../../assets/imgs/hidden-gems/faroe-islands-2.jpg') center/cover no-repeat";
          section.description = "Explore the world’s most breathtaking destinations, handpicked for adventurous travelers.";
          section.class = "section-new";
          section.isBackgroundVideo = true;
          section.backgroundVideoSource = "https://media.istockphoto.com/id/1976735092/video/ascending-together-couple-conquers-mountain-heights-at-sunset.mp4?s=mp4-640x640-is&k=20&c=HNyau2n-zGd3Ggvn445A611qfDgAXf4zj4G_QM7lh2A=";
        } else if (section.sectionId === 'wonders_of_the_world') {
          section.class = "galactic-wonders";
          section.description = "Embark on an adventure like never before! Discover hidden gems, breathtaking landscapes, and stories waiting to be told";
          section.isBackgroundVideo = true;
          section.backgroundVideoSource = "https://cdn.pixabay.com/video/2024/06/07/215697_large.mp4";
        } else {
          // section.background = "linear-gradient(to right, rgba(0, 119, 182, 0.8), rgba(244, 162, 97, 0.8)), url("+section.posts[0].imageUrl || section.posts[0].imageUrl+") center/cover no-repeat";
          section.description = "Explore breathtaking destinations, immerse yourself in cultures, and create memories that last a lifetime.";
          section.class = "adventure-section";
        }
      }
      this.commonService.sections.push({
        "sectionName": section.sectionName,
        "sectionId": section.sectionId
      });
    }
  }

  // redirectWithParams(path: string, query: {}) {
  //   this.commonService.navigateToQueryParams(path, query);
  // }

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
    this.commonService.navigateTo('section-detail/' + section.id);
  }
}
