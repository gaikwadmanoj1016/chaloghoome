import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post: any;
  public showLikeAnimation: boolean = false;
  showHideCommentBox: boolean = true;

  likePostBySingleClick(post: any) {
    post.liked = !post.liked;
    if (post.liked) {
      this.showLikeAnimation = true;
      // Reset liked property and hide animation after 1 second
      setTimeout(() => {
        this.showLikeAnimation = false;
      }, 1000);
    }
  }
  likePostByDblClick(post: any) {
    post.liked = true;
    this.showLikeAnimation = false;
    if (post.liked) {
      this.showLikeAnimation = true;
      // Reset liked property and hide animation after 1 second
      setTimeout(() => {
        this.showLikeAnimation = false;
      }, 1000);
    }
  }

  public toggleCommentSection(){
    this.showHideCommentBox = !this.showHideCommentBox;
  }
}
