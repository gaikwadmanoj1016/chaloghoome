import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

export class Tag {
  tagName: string = '';
  id!: number;
  postCount!: number;
}

@Component({
  selector: 'app-master-tag-list',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './master-tag-list.component.html',
  styleUrl: './master-tag-list.component.scss'
})
export class MasterTagListComponent implements OnInit {
  tags: Tag[] = [];
  showAddForm = signal(false);
  tagForm: FormGroup = new FormGroup({});
  constructor(private apiRequest: ApiService) { }
  ngOnInit(): void {
    this.tagForm = new FormGroup({
      tagName: new FormControl('', Validators.required)
    })
    this.getTags();
  }

  public getTags() {
    this.apiRequest.getMasterTagList().subscribe((response: any) => {
      if (response.result) {
        console.log(response);
        this.tags = response.data;
      } else {
        this.tags = [];
      }
    })
  }

  toggleAddForm() {
    this.showAddForm.set(!this.showAddForm());
  }

  deleteTag(tagId: number) {
    this.apiRequest.deleteTag(tagId).subscribe((response: any) => {
      if (response.result) {
        this.getTags();
      } else {

      }
    })
  }

  saveTag() {
    this.apiRequest.createTag(this.tagForm.value).subscribe((response: any) => {
      if (response.result) {
        this.getTags();
        this.toggleAddForm();
      } else {

      }
    });
  }
}
