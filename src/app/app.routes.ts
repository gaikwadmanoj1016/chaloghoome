import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { BuddiesComponent } from './modules/buddies/buddies.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', component: DashboardComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'buddies', component: BuddiesComponent },
    // { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to login by default
];
