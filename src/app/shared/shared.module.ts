import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewPostComponent } from './add-new-post/add-new-post.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PostsComponent } from './posts/posts.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CustomCropperModalComponent } from './custom-cropper-modal/custom-cropper-modal.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AddNewPostComponent,
    EditProfileComponent,
    PostsComponent,
    CustomCropperModalComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    MatDialogModule
  ],
  exports: [
    AddNewPostComponent,
    EditProfileComponent,
    PostsComponent,
    CustomCropperModalComponent
  ]
})
export class SharedModule { }
