import { Component, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-place-corousal',
  templateUrl: './place-corousal.component.html',
  styleUrl: './place-corousal.component.scss',
})
export class PlaceCorousalComponent {
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() grid: boolean = false;
  @Input() placesList: any[] = [];

  constructor(private commonService: CommonService) { }
  public navigateTo(path: string) {
    this.commonService.navigateToQueryParams(path, { filter: this.id });
  }

  public explorePlace(id: number) {
    this.commonService.navigateToQueryParams('place-details', { placeId: id });
  }
}
