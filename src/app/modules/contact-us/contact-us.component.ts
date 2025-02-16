import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
      // Here you can submit the form data to your backend or perform other actions
    } else {
      console.error('Form is invalid');
    }
  }

}
