import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { BuddiesComponent } from './modules/buddies/buddies.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { PlaceListComponent } from './modules/landing-page/place-list/place-list.component';
import { PlaceDetailsComponent } from './modules/landing-page/place-list/place-details/place-details.component';
import { AdminPanelComponent } from './modules/admin-panel/admin-panel.component';
import { SectionComponent } from './modules/admin-panel/section/section.component';
import { ViewPostComponent } from './modules/admin-panel/section/view-post/view-post.component';
import { SitemapComponent } from './root/sitemap/sitemap.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { ContactUsComponent } from './modules/contact-us/contact-us.component';
import { NotFoundComponent } from './root/not-found/not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin-panel', component: AdminPanelComponent },
    { path: 'admin-panel/section-detail/:sectionId', component: SectionComponent },
    { path: 'section-detail/:sectionId', component: SectionComponent },
    { path: 'section-detail/:sectionId/post/:postId', component: ViewPostComponent },
    // { path: '', component: DashboardComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'about_us', component: AboutUsComponent },
    { path: 'contact_us', component: ContactUsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'buddies', component: BuddiesComponent },
    { path: 'places', component: PlaceListComponent },
    { path: 'place-details', component: PlaceDetailsComponent },
    // { path: 'sitemap.xml', component: SitemapComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to login by default
    { path: '**', component: NotFoundComponent }
];
