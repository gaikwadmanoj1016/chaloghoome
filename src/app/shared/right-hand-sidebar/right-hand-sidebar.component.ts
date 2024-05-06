import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-right-hand-sidebar',
  standalone: false,
  templateUrl: './right-hand-sidebar.component.html',
  styleUrl: './right-hand-sidebar.component.scss'
})
export class RightHandSidebarComponent {
  isShow: boolean = false;
  constructor(private commonService: CommonService) { }

  navigateTo(path: string) {
    this.commonService.navigateTo(path);
  }
}
