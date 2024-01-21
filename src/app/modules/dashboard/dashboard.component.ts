import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  public newPostForm: any;
  public selectedFile: any;
  newPostContent: string = '';
  editorConfig = {};
  isOpen: boolean = false;

  constructor(private fb: FormBuilder,private router: Router) { }

  ngOnInit() {
    
    this.newPostForm = this.fb.group({
      postContent: [''],
      image: [null]
    });
    this.editorConfig = {
      editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '100px',
      placeholder: 'Enter your post content here...',
      translate: 'no',
    };
  }

  isModalOpen: boolean = false;

  showSearchBar(): boolean {
    const currentRoute = this.router.url;
    return !currentRoute.includes('profile');
  }

  openModal() {
    this.isModalOpen = true;
  }

  toggleModal(flag: boolean) {
    this.isModalOpen = flag;
  }
}
