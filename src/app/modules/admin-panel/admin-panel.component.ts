import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [SharedModule, RouterLink, RouterOutlet],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

}
