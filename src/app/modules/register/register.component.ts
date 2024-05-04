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
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      isGuide: [false],
      username: ['', Validators.required],
      businessName: [''],
    });
  }

  onSubmit() {
    console.log(this.registrationForm)
    if (this.registrationForm.valid) {
      // Implement your registration logic here
    }
    this.commonService.navigateTo('dashboard');
  }

  goToNextPage() {
    this.pageNumber = 2;
  }
  goToPreviousPage() {
    if(this.pageNumber === 2){
      this.pageNumber = 1;
    }else{
      this.commonService.navigateTo('login');
    }
  }
}
