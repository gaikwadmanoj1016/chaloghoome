import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { AdminPanelHeaderComponent } from "./admin-panel-header/admin-panel-header.component";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [SharedModule, RouterLink, RouterOutlet, AdminPanelHeaderComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  sidebarCollapsed = false;
  constructor(private route: ActivatedRoute, public commonService: CommonService) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.routeConfig);
    // this.commonService.navigateTo('admin-panel/sections');
  }
  
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  closeSidebar() {
    this.sidebarCollapsed = false;
  }
}
