import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SignInWithGoogleComponent } from '../sign-in-with-google/sign-in-with-google.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApiService } from '../../shared/services/api.service';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink, MatGridListModule, MatSelectModule, MatCheckboxModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatSliderModule, MatButtonModule, MatIconModule, SignInWithGoogleComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  pageNumber: number = 1;
  step = 1;
  isGuideSelected: any;
  countryWiseLanguagesList: any[] = [];
  selectedLanguages: any[] = [];

  // languagesList = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese']; // Add your languages here

  constructor(private fb: FormBuilder, private commonService: CommonService, private apiService: ApiService, private snackbar: SnackbarService) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      isGuide: [false],
      // businessName: ['', this.isGuideSelected ? Validators.required : []],
      // experience: ['', this.isGuideSelected ? [Validators.required, Validators.min(0)] : []],
      // languages: this.fb.array([]), // this will hold selected languages + skills
      // languageToAdd: [''], // For dropdown selection
    });
  }

  ngOnInit(): void {
    this.getAllLanguages();
  }
  // get isGuide() {
  //   return this.registrationForm.get('isGuide')?.value;
  // }

  getAllLanguages() {
    this.apiService.getAllLanguages().subscribe((response: any) => {
      if (response) {
        console.log(response);
        this.countryWiseLanguagesList = response;
        this.countryWiseLanguagesList.forEach(country => {
          country.languages.sort((a: any, b: any) => a.name.localeCompare(b.name));
        });
      } else {

      }
    })
  }

  goToNextPage() {
    this.pageNumber = 2;
  }
  goToPreviousPage() {
    if (this.pageNumber === 2) {
      this.pageNumber = 1;
    } else {
      this.commonService.navigateTo('login');
    }
  }
  loginWithGoogle(event: Event) {
    console.log(event);
  }

  onLoginInError(event: Event) {
    console.log(event);
  }

  enforceNumeric(event: any): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.registrationForm.get('phone')?.setValue(event.target.value, { emitEvent: false });
  }

  handleToggle(event: any) {
    this.registrationForm.get('isGuide')?.setValue((event.target as HTMLInputElement).checked);
    const isGuide = event.target.checked;
    this.isGuideSelected = isGuide;

    // const experience = this.registrationForm.get('experience');
    // const languages = this.registrationForm.get('languages');

    // if (this.isGuideSelected) {
    //   experience?.setValidators([Validators.required, Validators.min(0)]);
    //   languages?.setValidators(Validators.required);
    // } else {
    //   experience?.clearValidators();
    //   languages?.clearValidators();
    // }

    // experience?.updateValueAndValidity();
    // languages?.updateValueAndValidity();
  }

  onLanguageSelect(lang: any) {
    const alreadySelected = this.selectedLanguages.find(l => l.name === lang.name);
    if (!alreadySelected) {
      this.selectedLanguages.push({
        ...lang,
        skills: {
          read: false,
          write: false,
          speak: false,
          native: false
        }
      });
      // Also add to FormArray as FormGroup
      this.languagesFormArray.push(this.fb.group({
        name: [lang.name, Validators.required],
        code: [lang.code],
        skills: this.fb.group({
          read: [false],
          write: [false],
          speak: [false],
          native: [false],
        })
      }));
    }
  }

  get languagesFormArray(): FormArray {
    return this.registrationForm.get('languages') as FormArray;
  }

  compareLanguages(lang1: any, lang2: any): boolean {
    return lang1 && lang2 ? lang1.name === lang2.name && lang1.code === lang2.code : lang1 === lang2;
  }

  removeLanguage(index: number) {
    this.selectedLanguages.splice(index, 1);
    this.languagesFormArray.removeAt(index);
  }
  // This method will be used to send data to backend
  getSelectedLanguageData() {
    return this.selectedLanguages;
  }

  onSubmit() {
    console.log(this.registrationForm);
    //     {
    //     "firstName": "Manoj",
    //     "lastName": "gaikwad",
    //     "phone": "8888331416",
    //     "email": "manojgaikwad715@gmail.com",
    //     "isGuide": true,
    //     "businessName": "sjdhasjk",
    //     "experience": 3,
    //     "languages": [
    //         {
    //             "name": "Assamese",
    //             "code": "as",
    //             "skills": {
    //                 "read": false,
    //                 "write": false,
    //                 "speak": false,
    //                 "native": false
    //             }
    //         },
    //         {
    //             "name": "Bodo",
    //             "code": "brx",
    //             "skills": {
    //                 "read": false,
    //                 "write": false,
    //                 "speak": false,
    //                 "native": false
    //             }
    //         }
    //     ],
    //     "languageToAdd": {
    //         "name": "Bodo",
    //         "code": "brx"
    //     }
    // }
    if (this.registrationForm.valid) {
      if (!(this.registrationForm.get('phone')?.value || this.registrationForm.get('email')?.value)) {
        this.snackbar.showError("Phone number or email address is required.");
        return;
      }
      this.apiService.registration(this.registrationForm.value).subscribe((response: any) => {
        if (response.result) {

        } else {

        }
      })
      // Implement your registration logic here
      this.commonService.navigateTo('profile');
    }
    else {
      this.snackbar.showError("Form is not valid")
    }
  }
}
