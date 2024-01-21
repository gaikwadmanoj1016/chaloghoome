import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  public showLikeAnimation: boolean = false;
  public postData: any[] = [];
  getDummyData(): any[] {
    return [
      {
        id: 1,
        user: {
          userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
          username: 'Kedar Ingale',
        },
        postDetails:{
          images: ['assets/imgs/Greece Travel Aesthetics __ Greece honeymoon vacation.jpg'],
          postDescription: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus ex earum veniam, culpa nostrum, voluptatibus perferendis error nisi natus molestiae, sint quod repellendus.',
          tags: ['sjdfs', 'saiefh', 'cuyuwe'],
          likes: 42,
          comments: 126,
        },
        liked: true
      },
      {
        id: 2,
        user: {
          userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
          username: 'Vipul Gawade',
        },
        postDetails:{
          images: ['assets/imgs/pexels-nina-uhlikova-287240.jpg', 'assets/imgs/pexels-spencer-davis-4388287.jpg', 'assets/imgs/Greece Travel Aesthetics __ Greece honeymoon vacation.jpg'],
          postDescription: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus ex earum veniam, culpa nostrum, voluptatibus perferendis error nisi natus molestiae, sint quod repellendus.',
          tags: ['sjdfs', 'saiefh', 'cuyuwe'],
          likes: 517,
          comments: 23,
        },
        liked: true
      },
      {
        id: 3,
        user: {
          userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
          username: 'Suraj Gawade',
        },
        postDetails:{
          images: ['assets/imgs/pexels-spencer-davis-4388287.jpg', 'assets/imgs/pexels-spencer-davis-4388287.jpg'],
          postDescription: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus ex earum veniam, culpa nostrum, voluptatibus perferendis error nisi natus molestiae, sint quod repellendus.',
          tags: ['sjdfs', 'saiefh', 'cuyuwe'],
          likes: 157,
          comments: 243,
        },
        liked: false
      },
    ];
  }

  ngOnInit(): void {
    this.postData = this.getDummyData();
  }

  
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
}
