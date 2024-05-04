import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  navigateToQueryParams(path: string, query: any) {
    this.router.navigate([path], { queryParams: query });
  }

  scrollToDiv(elementId: string | null): void {
    if(elementId){
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
