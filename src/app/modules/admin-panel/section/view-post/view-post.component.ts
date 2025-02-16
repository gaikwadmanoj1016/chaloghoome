import { Component } from '@angular/core';
import { PlaceDetailsComponent } from "../../../landing-page/place-list/place-details/place-details.component";

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [PlaceDetailsComponent],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss'
})
export class ViewPostComponent {

}
