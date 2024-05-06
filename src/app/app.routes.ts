import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { BuddiesComponent } from './modules/buddies/buddies.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { PlaceListComponent } from './modules/landing-page/place-list/place-list.component';
import { PlaceDetailsComponent } from './modules/landing-page/place-list/place-details/place-details.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', component: DashboardComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'buddies', component: BuddiesComponent },
    { path: 'places', component: PlaceListComponent },
    { path: 'place-details', component: PlaceDetailsComponent },
    // { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect to login by default
];
