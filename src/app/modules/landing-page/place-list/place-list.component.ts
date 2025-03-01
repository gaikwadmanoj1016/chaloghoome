import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './place-list.component.html',
  styleUrl: './place-list.component.scss'
})
export class PlaceListComponent implements OnInit {
  filter: string = '';
  pageName: string = '';
  list: any[] = [];

  constructor(private route: ActivatedRoute, private commonService: CommonService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((param: any) => {
      if (param && param['filter']) {
        this.filter = param['filter'];
        this.sortFilteredList();
      }
    })
  }

  private sortFilteredList(){
    if(this.filter === 'wonders_of_world'){
      this.pageName = 'Wonders of world';
      this.list = this.commonService.wonders;
    }
    if(this.filter === 'hidden_gems'){
      this.pageName = 'Hidden Gems';
      this.list = this.commonService.hiddenGems;
    }
    if(this.filter === 'most_visited_places'){
      this.pageName = 'Most Visited Places';
      this.list = this.commonService.mostVisited;
    }
  }

  navigateTo(item: any) {
    this.commonService.navigateToQueryParams('place-details', { placeId: item.id });
  }
}
