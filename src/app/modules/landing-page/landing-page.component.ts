import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule, MatIconModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  scrollToDivId: string | null = '';
  constructor(private route: ActivatedRoute, private commonService: CommonService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params && params.get("section")) {
        this.scrollToDivId = params.get("section");
        console.log(this.scrollToDivId);
        this.commonService.scrollToDiv(this.scrollToDivId);
      } else {
        this.commonService.scrollToTop();
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
      // Here you can submit the form data to your backend or perform other actions
    } else {
      console.error('Form is invalid');
    }
  }

  redirectTo(path: string, query: {}){
    this.commonService.navigateToQueryParams(path, query);
  }
}
