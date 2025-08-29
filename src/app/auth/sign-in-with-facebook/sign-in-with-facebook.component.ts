import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

declare var FB: any; // 👈 Declare Facebook global object

declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

@Component({
  selector: 'app-sign-in-with-facebook',
  templateUrl: './sign-in-with-facebook.component.html',
  styleUrls: ['./sign-in-with-facebook.component.scss'],
  standalone: true,
  imports: []
})
export class SignInWithFacebookComponent implements OnInit, AfterViewInit {
  @Output() onGoogleLogin: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    window.fbAsyncInit = () => {
      FB.init({
        appId: '711395771266258',
        cookie: true,
        xfbml: true,
        version: 'v23.0' // Use latest stable version
      });
      FB.AppEvents.logPageView();
      FB.getLoginStatus((response: any) => {
        this.statusChangeCallback(response);
      });
    };
  }
  checkLoginState() {
    FB.getLoginStatus((response: any) => {
      this.statusChangeCallback(response);
    });
  }

  statusChangeCallback(response: any) {
    console.log(response);
  }

  loginWithFacebook() {
    FB.login((response: any) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'id,name,email,first_name,last_name,picture,locale,timezone,link' }, (userInfo: any) => {
          console.log('Facebook user info:', userInfo);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email,public_profile' });
  }

}
