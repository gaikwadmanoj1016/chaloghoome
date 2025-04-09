import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CommonService } from '../../services/common.service';

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  currentRoute: string = '';

  constructor(private route: ActivatedRoute, private el: ElementRef, public commonService: CommonService) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.routeConfig?.path);
    this.currentRoute = this.route.snapshot.routeConfig?.path || '';
  }

  ngAfterViewInit(): void {
    this.paralaxText();
    this.aboutAnimation();
  }

  private paralaxText() {
    if (window.innerWidth <= 1500) {
      // Skip animation below tab screens
      return;
    }
    const paras = this.el.nativeElement.querySelectorAll('.paralax .content-1 .para');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.paralax',
        start: 'top top',
        end: () => `+=${paras.length * 200}%`,
        scrub: true,
        pin: true,
        markers: false
      }
    });

    paras.forEach((para: HTMLElement, i: number) => {
      tl.to(para, { opacity: 1, y: 0, duration: 1 }, i);
      if (i < paras.length - 1) {
        tl.to(para, { opacity: 0, y: 0, duration: 1 }, i + 0.5);
      }
    });
  }

  private aboutAnimation() {
    return;
    document.querySelectorAll(".section").forEach((section) => {
      const text = section.querySelector(".text");
      const image = section.querySelector(".image");
      const button = section.querySelector(".explore-about");

      const isImageOnRight = section.classList.contains("image-on-right");

      const headings = section.querySelectorAll("h1, h2");

      gsap.from(headings, {
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: -40,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      });
      if (text) {
        gsap.from(text.querySelectorAll("p"), {
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
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
            start: "top 50%",
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
          start: "top 50%",
          toggleActions: "play none none reverse",
          markers: true
        },
        opacity: 0,
        x: isImageOnRight ? 100 : -100,
        duration: 1,
        ease: "power3.out",
      });

      if (button) {
        gsap.from(button, {
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          delay: 0.3,
          ease: "back.out(1.7)",
        });
      }
    });
  }
}
