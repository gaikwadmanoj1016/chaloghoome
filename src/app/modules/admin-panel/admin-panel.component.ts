import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [SharedModule, RouterLink, RouterOutlet],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  sidebarCollapsed = false;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.routeConfig?.path);
    
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

}
