import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit() {
  }

}
