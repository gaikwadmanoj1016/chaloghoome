import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  requiredPattern = /^[a-z0-9._%+!$&*=^|~#%'`?{}\-]+@([a-z0-9\-]+\.)+[a-z]{2,16}$/;

  constructor(private apiService: ApiService) { }
  onSubmit(form: any) {
    if (form.valid) {
      console.log(form.value);
      // Here you can submit the form data to your backend or perform other actions
      this.apiService.triggerContactUsEmail(form.value).subscribe((response: any) => {
        if (response.result) {
          console.log("email send successfully");
          
        } else {
          console.error("error in sending mail ", response.message);
          
        }
      })
    } else {
      console.error('Form is invalid');
    }
  }

}
