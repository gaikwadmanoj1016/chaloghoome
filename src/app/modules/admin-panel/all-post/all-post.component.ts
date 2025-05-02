import { Component } from '@angular/core';
import { PlaceCardComponent } from '../../../shared/place-card/place-card.component';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { AddPostComponent } from '../section/view-post/add-post/add-post.component';
import { slugify } from '../../../utils/slugify';

@Component({
  selector: 'app-all-post',
  standalone: true,
  imports: [SharedModule, AddPostComponent, RouterLink],
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.scss'
})
export class AllPostComponent {
  public places: any[] = [];
  cardEditable: boolean = false;
  selectedCard: any;
  showHidePostForm: boolean = false;
  slugify = slugify;
  constructor(private route: ActivatedRoute, private apiService: ApiService, public commonService: CommonService) {

  }

  ngOnInit(): void {
    this.cardEditable = this.route.snapshot.routeConfig?.path?.includes('sections') || false;
    this.getAllplaces();
  }

  getAllplaces() {
    this.apiService.getAllPlaces().subscribe((response: any) => {
      if (response.result) {
        this.places = response.data;
        if (this.places && this.places.length > 0) {
          this.places.forEach((item: any) => {
            item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
          });
          this.commonService.setMetaData(`${this.places.length} Places information`, {summary: "Explore breathtaking destinations, immerse yourself in cultures, and create memories that last a lifetime.", originalThumbnailImg: this.places[0].thumbnailImg});
        }
      } else {

      }
    })
  }

  navigateTo(path: string) {
    this.commonService.navigateTo(path);
  }

  onEditCard(item: any) {
    // this.selectedCard = item;
    let query = `id=${item.id}`;
    this.apiService.getPostDetails(query).subscribe((response: any) => {
      if (response.result) {
        this.selectedCard = response.data;
        this.showHidePostForm = true;
      } else {

      }
    })
  }
  deletePost(item: any) {
    // this.selectedCard = item;
    this.apiService.deletePost(item.id).subscribe((response: any) => {
      if (response.result) {
        console.log("delete successfully");
        this.getAllplaces();
      } else {
        console.error("error deleting post")
      }
    })
  }
  public showHideAddPostForm() {
    this.showHidePostForm = !this.showHidePostForm;
  }
  public closePostPopup() {
    this.showHidePostForm = false;
  }
  public onPostUpdate() {
    this.getAllplaces();
  }
}
