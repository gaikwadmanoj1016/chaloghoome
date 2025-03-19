import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-place-corousal',
  templateUrl: './place-corousal.component.html',
  styleUrl: './place-corousal.component.scss',
})
export class PlaceCorousalComponent implements OnInit {
  @Input() section: any;
  @Input() id: string = '';
  @Input() showCount!: number;
  @Input() grid: boolean = false;
  @Input() placesList: any[] = [];

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    if(this.placesList && this.placesList.length > 0){
      this.placesList.map(item => {
        item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
        return item;
      })
    }
    console.log(this.placesList);
  }
  public redirectTo(path: string) {
    this.commonService.navigateTo(path);
  }

  public navigateTo() {
    this.commonService.navigateTo('section-detail/' + this.section.id);
  }

  // public explorePlace(id: number) {
  //   this.commonService.navigateToQueryParams('place-details', { placeId: id });
  // }

  // onImageLoad(item: any){
  //   console.log("event loaded ", item.location);
  //   item.loaded = true;
  // }
}
