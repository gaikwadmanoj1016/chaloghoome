import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registrationForm: FormGroup;
  pageNumber: number = 1;
  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.pattern(/^\d{10}$/)], // Assuming 10-digit phone number
      isGuide: [false]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // Implement your registration logic here
      this.commonService.navigateTo('login');
    }
  }

  goToNextPage() {
    this.pageNumber = 2;
  }
  goToPreviousPage() {
    this.pageNumber = 1;
  }
}
