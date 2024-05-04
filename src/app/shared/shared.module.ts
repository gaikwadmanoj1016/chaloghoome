import { NgModule } from '@angular/core';
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



@NgModule({
  declarations: [
    AddNewPostComponent,
    EditProfileComponent,
    PostsComponent,
    CustomCropperModalComponent,
    PostComponent,
    AutoExpandingTextareaComponent,
    PlaceCorousalComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [
    AddNewPostComponent,
    EditProfileComponent,
    PostsComponent,
    CustomCropperModalComponent,
    PostComponent,
    AutoExpandingTextareaComponent,
    PlaceCorousalComponent
  ]
})
export class SharedModule { }
