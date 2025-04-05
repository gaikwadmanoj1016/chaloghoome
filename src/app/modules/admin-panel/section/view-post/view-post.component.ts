import { Component } from '@angular/core';
import { PlaceDetailsComponent } from "../../../landing-page/place-list/place-details/place-details.component";
import { PlaceDetailsNewComponent } from '../../../landing-page/place-list/place-details-new/place-details-new.component';

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [PlaceDetailsComponent, PlaceDetailsNewComponent],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss'
})
export class ViewPostComponent {

}
