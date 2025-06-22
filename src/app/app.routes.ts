import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { BuddiesComponent } from './modules/buddies/buddies.component';
import { LandingPageComponent } from './modules/landing-page/landing-page.component';
import { PlaceListComponent } from './modules/landing-page/place-list/place-list.component';
import { PlaceDetailsComponent } from './modules/landing-page/place-list/place-details/place-details.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SectionComponent } from './admin-panel/section/section.component';
import { ViewPostComponent } from './admin-panel/view-post/view-post.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { ContactUsComponent } from './modules/contact-us/contact-us.component';
import { NotFoundComponent } from './root/not-found/not-found.component';
import { SearchResultsComponent } from './modules/search-results/search-results.component';
import { SettingSectionComponent } from './admin-panel/setting-section/setting-section.component';
import { PlaceDetailsNewComponent } from './modules/landing-page/place-list/place-details-new/place-details-new.component';
import { MasterTagListComponent } from './admin-panel/master-tag-list/master-tag-list.component';
import { MasterCategoryListComponent } from './admin-panel/master-category-list/master-category-list.component';
import { AllPostComponent } from './admin-panel/all-post/all-post.component';
import { GuideProfileComponent } from './modules/guide-profile/guide-profile.component';
import { EditProfileComponent } from './modules/edit-profile/edit-profile.component';
import { AddPostComponent } from './admin-panel/view-post/add-post/add-post.component';
import { PlaceByCategoryComponent } from './modules/categories/place-by-category/place-by-category.component';
import { CategoriesComponent } from './modules/categories/categories.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin-panel', component: AdminPanelComponent, children: [
            { path: 'sections', component: SettingSectionComponent },
            { path: 'sections/places/:sectionName', component: ViewPostComponent },
            { path: 'sections/places', component: AllPostComponent },
            { path: 'add-place/:id', component: AddPostComponent },
            { path: 'tags', component: MasterTagListComponent },
            { path: 'categories', component: MasterCategoryListComponent },
            // { path: 'guides', component: GuidesComponent },
            // { path: 'place-features', component: PlaceFeaturesComponent },
            // { path: 'unique-features', component: UniqueFeaturesComponent },
        ]
    },
    // { path: 'admin-panel/places/:sectionName', component: SectionComponent },
    { path: 'places', component: AllPostComponent },
    { path: 'places/:sectionName', component: SectionComponent },
    { path: 'place/:postName', component: PlaceDetailsComponent },
    // { path: '', component: DashboardComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'about_us', component: AboutUsComponent },
    { path: 'contact_us', component: ContactUsComponent },
    { path: 'guide-profile', component: GuideProfileComponent },
    { path: 'edit-profile', component: EditProfileComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'buddies', component: BuddiesComponent },
    { path: 'places', component: PlaceListComponent },
    { path: 'place-details', component: PlaceDetailsComponent },
    { path: 'search/:query', component: SearchResultsComponent }, // Search route
    { path: 'travel-categories', component: CategoriesComponent },
    { path: 'travel-category/:catName', component: PlaceByCategoryComponent },
    // { path: 'sitemap.xml', component: SitemapComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to login by default
    { path: '**', component: NotFoundComponent }
];
