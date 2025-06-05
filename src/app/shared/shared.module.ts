import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { PostsComponent } from './components/posts/posts.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CustomCropperModalComponent } from './components/custom-cropper-modal/custom-cropper-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PostComponent } from './components/posts/post/post.component';
import { AutoExpandingTextareaComponent } from './components/auto-expanding-textarea/auto-expanding-textarea.component';
import { PlaceCorousalComponent } from './components/place-corousal/place-corousal.component';
import { BuddyCardComponent } from './components/buddy-card/buddy-card.component';
import { RightHandSidebarComponent } from '../root/right-hand-sidebar/right-hand-sidebar.component';
import { ClickOutsideDirective } from '../utils/directives/click-outside.directive';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { TruncatePipe } from '../utils/pipes/truncate.pipe';
import { PlaceCardComponent } from './components/place-card/place-card.component';
import { ApiService } from './services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonService } from './services/common.service';
import { HttpRequestsService } from './services/http-request.service';
import { ProgressiveImageComponent } from './components/progressive-image/progressive-image.component';
import { RouterModule } from '@angular/router';
import { HighlightsModalComponent } from './components/place-card/highlights-modal/highlights-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from '../app.routes';
import { TravelMapComponent } from './components/travel-map/travel-map.component';


@NgModule({
  declarations: [
    AddNewPostComponent,
    EditProfileComponent,
    PostsComponent,
    CustomCropperModalComponent,
    PostComponent,
    AutoExpandingTextareaComponent,
    PlaceCorousalComponent,
    BuddyCardComponent,
    RightHandSidebarComponent,
    ClickOutsideDirective,
    CertificatesComponent,
    TruncatePipe,
    PlaceCardComponent,
    ProgressiveImageComponent,
    HighlightsModalComponent,
    TravelMapComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    // RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    AddNewPostComponent,
    EditProfileComponent,
    PostsComponent,
    CustomCropperModalComponent,
    PostComponent,
    AutoExpandingTextareaComponent,
    PlaceCorousalComponent,
    BuddyCardComponent,
    RightHandSidebarComponent,
    ClickOutsideDirective,
    CertificatesComponent,
    TruncatePipe,
    PlaceCardComponent,
    ProgressiveImageComponent,
    HighlightsModalComponent,
    TravelMapComponent
  ],
  providers: [ApiService]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [HttpRequestsService, ApiService, CommonService, HttpClient]
    };
  }
}

