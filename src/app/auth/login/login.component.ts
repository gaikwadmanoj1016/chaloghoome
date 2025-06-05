import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { SignInWithGoogleComponent } from '../sign-in-with-google/sign-in-with-google.component';
import { SignInWithFacebookComponent } from "../sign-in-with-facebook/sign-in-with-facebook.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, RouterLink, ReactiveFormsModule, SignInWithGoogleComponent, SignInWithFacebookComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  goToSignUpPage() {
    this.commonService.navigateTo('register')
  }
  // Method to handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      // Implement your login logic here
      this.commonService.navigateTo('dashboard');
    }
  }
  loginWithGoogle(event: Event) {
    console.log(event);
  }
  loggedInWithFB(event: Event) {
    console.log(event);
  }
  onLoginInError(event: Event) {
    console.log(event);
  }
}
