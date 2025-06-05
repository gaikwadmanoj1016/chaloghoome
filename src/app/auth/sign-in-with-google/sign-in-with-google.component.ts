import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { jwtDecode } from 'jwt-decode';

declare const google: any;

@Component({
  selector: 'app-sign-in-with-google',
  templateUrl: './sign-in-with-google.component.html',
  styleUrls: ['./sign-in-with-google.component.scss'],
  standalone: true,
  imports: []
})
export class SignInWithGoogleComponent implements OnInit, AfterViewInit {
  @Output() onGoogleLogin: EventEmitter<any> = new EventEmitter();

  @Input() label: string = '';
  constructor() { }

  ngOnInit() {
  }

  
  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '600899914458-0hr1cniua3u1vc1vto0keg3e33dglljr.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      {
        theme: 'outline',
        size: 'large',
        // shape: 'pill',
        // type: 'icon',
        text: this.label,
      }
    );

    google.accounts.id.prompt(); // optional - shows the One Tap prompt
  }

  handleCredentialResponse(response: any) {
    const jwt = response.credential;
    console.log('JWT Token:', jwt);

    // Optionally decode JWT using jwt-decode:
    const user = jwtDecode(jwt);
    console.log('User:', user);
    this.onGoogleLogin.emit(user);
  }

}
