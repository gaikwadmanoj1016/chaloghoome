import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewPostComponent } from './add-new-post/add-new-post.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PostsComponent } from './posts/posts.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CustomCropperModalComponent } from './custom-cropper-modal/custom-cropper-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PostComponent } from './posts/post/post.component';
import { AutoExpandingTextareaComponent } from './auto-expanding-textarea/auto-expanding-textarea.component';
import { PlaceCorousalComponent } from './place-corousal/place-corousal.component';
import { BuddyCardComponent } from './buddy-card/buddy-card.component';
import { RightHandSidebarComponent } from './right-hand-sidebar/right-hand-sidebar.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CertificatesComponent } from './certificates/certificates.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { PlaceCardComponent } from './place-card/place-card.component';
import { ApiService } from '../services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { HttpRequestsService } from '../services/http-request.service';
import { ProgressiveImageComponent } from './progressive-image/progressive-image.component';
import { RouterModule } from '@angular/router';



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
    ProgressiveImageComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    RouterModule
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
    ProgressiveImageComponent
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

