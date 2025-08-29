import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
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
          postDescription: 'It is renowned for its historical and archaeological significance, as it was once the capital of the Vijayanagara Empire, one of the greatest Hindu empires in South India, which thrived from the 14th to the 16th century.',
          title: 'Humpi Karnataka One Day Tour.',
          tags: ['hampi', 'karnataka', 'karnatakatourism', 'india', 'hampidiaries', 'travelphotography', 'photography', 'incredibleindia', 'travelkarnataka', 'hampitourism', 'mysore', 'focus', 'bengaluru', 'ig', 'incrediblekarnataka', 'wanderlust', 'mysuru', 'udupi', 'bangalore', 'travel', 'travelblogger', 'travelindia', 'shivamogga', 'indianphotography', 'bellary', 'mangalore', 'karnatakapictures', 'incredible', 'one', 'hubli',],
          likes: 42,
          comments: 126,
          guideDetails: {
            name: "Ratanlal Pingale",
          }
        },
        liked: true,
        comments: [
          {
            id: 1,
            userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
            username: 'Kedar Ingale',
            comment: 'This is amazing! This is amazing! This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing!  This is amazing! ',
            likes: 23,
            reply: [
              {
                id: 3,
                userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
                username: 'Manoj G',
                comment: 'Great!',
                likes: 2,
              },
              {
                id: 4,
                userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
                username: 'Govind Mali',
                comment: 'awesome!',
                likes: 2,
              }
            ]
          },
          {
            id: 2,
            userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
            username: 'Vipul Gawade',
            comment: 'Amazing click!',
            likes: 3
          }
        ]
      },
      {
        id: 2,
        user: {
          userProfile: 'assets/imgs/The Perfect Egypt Itinerary - 10 Days of Exploring History - Lisa Homsy.jpg',
          username: 'Vipul Gawade',
        },
        postDetails:{
          images: ['assets/imgs/pexels-nina-uhlikova-287240.jpg', 'assets/imgs/pexels-spencer-davis-4388287.jpg', 'assets/imgs/Greece Travel Aesthetics __ Greece honeymoon vacation.jpg'],
          title: 'Humpi Karnataka One Day Tour.',
          postDescription: 'It is renowned for its historical and archaeological significance, as it was once the capital of the Vijayanagara Empire, one of the greatest Hindu empires in South India, which thrived from the 14th to the 16th century.',
          tags: ['hampi', 'karnataka', 'karnatakatourism', 'india', 'hampidiaries', 'travelphotography', 'photography', 'incredibleindia', 'travelkarnataka', 'hampitourism', 'mysore', 'focus', 'bengaluru', 'ig', 'incrediblekarnataka', 'wanderlust', 'mysuru', 'udupi', 'bangalore', 'travel', 'travelblogger', 'travelindia', 'shivamogga', 'indianphotography', 'bellary', 'mangalore', 'karnatakapictures', 'incredible', 'one', 'hubli',],
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
          title: 'Humpi Karnataka One Day Tour.',
          postDescription: 'It is renowned for its historical and archaeological significance, as it was once the capital of the Vijayanagara Empire, one of the greatest Hindu empires in South India, which thrived from the 14th to the 16th century.',
          tags: ['hampi', 'karnataka', 'karnatakatourism', 'india', 'hampidiaries', 'travelphotography', 'photography', 'incredibleindia', 'travelkarnataka', 'hampitourism', 'mysore', 'focus', 'bengaluru', 'ig', 'incrediblekarnataka', 'wanderlust', 'mysuru', 'udupi', 'bangalore', 'travel', 'travelblogger', 'travelindia', 'shivamogga', 'indianphotography', 'bellary', 'mangalore', 'karnatakapictures', 'incredible', 'one', 'hubli',],
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
}
