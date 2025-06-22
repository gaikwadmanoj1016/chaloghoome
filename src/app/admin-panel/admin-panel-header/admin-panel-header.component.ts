import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-admin-panel-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-panel-header.component.html',
  styleUrl: './admin-panel-header.component.scss'
})
export class AdminPanelHeaderComponent implements OnInit {
  @Output() onToggleSidebar: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSidebar: EventEmitter<any> = new EventEmitter();
 
  constructor(public commonService: CommonService) {}
  ngOnInit(): void {
    
  }

  toggleSidebar() {
    this.onToggleSidebar.emit();
  }
  
  closeSidebar() {
    this.onCloseSidebar.emit();
  }
}
