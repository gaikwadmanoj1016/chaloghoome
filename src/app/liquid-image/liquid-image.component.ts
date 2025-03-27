import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-liquid-image',
  templateUrl: './liquid-image.component.html',
  styleUrls: ['./liquid-image.component.scss']
})
export class LiquidImageComponent {
//   @ViewChild('displacement', { static: true }) displacementRef!: ElementRef;
//   @ViewChild('wrapper', { static: true }) wrapperRef!: ElementRef;

//   private isHovering = false;

//   ngAfterViewInit() {}

//   @HostListener('mousemove', ['$event'])
//   onMouseMove(event: MouseEvent) {
//     if (!this.isHovering) return;

//     const bounds = this.wrapperRef.nativeElement.getBoundingClientRect();
//     const x = (event.clientX - bounds.left) / bounds.width;
//     const y = (event.clientY - bounds.top) / bounds.height;

//     // Change scale dynamically based on distance from center
//     const dx = x - 0.5;
//     const dy = y - 0.5;
//     const distance = Math.sqrt(dx * dx + dy * dy);

//     const maxDistortion = 100;
//     const distortion = maxDistortion * distance;

//     gsap.to(this.displacementRef.nativeElement, {
//       attr: { scale: distortion },
//       duration: 0.4,
//       ease: 'power2.out'
//     });
//   }

//   hover(state: boolean) {
//     this.isHovering = state;
//     if (!state) {
//       gsap.to(this.displacementRef.nativeElement, {
//         attr: { scale: 0 },
//         duration: 0.6,
//         ease: 'expo.out'
//       });
//     }
//   }
}
