import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() sections: any[] = [];

  constructor(public commonService: CommonService) {}
  
  scrollTo(sectionId: string) {
    this.commonService.scrollToDiv(sectionId);
  }
}
