import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { SharedModule } from '../../../shared/shared.module';

export class Category {
  catName: string = '';
  id!: number;
}
@Component({
  selector: 'app-master-category-list',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './master-category-list.component.html',
  styleUrl: './master-category-list.component.scss'
})
export class MasterCategoryListComponent implements OnInit {
  categories: Category[] = [];
  showAddForm = signal(false);
  categoryForm: FormGroup = new FormGroup({});
  constructor(private apiRequest: ApiService) { }
  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      catName: new FormControl('', Validators.required)
    });
    this.getCategories();
  }
  public getCategories() {
    this.apiRequest.getMasterCategoryList().subscribe((response: any) => {
      if (response.result) {
        console.log(response);
        this.categories = response.data;
      } else {
        this.categories = [];
      }
    })
  }

  toggleAddForm() {
    this.showAddForm.set(!this.showAddForm());
  }

  deleteCategory(catId: number) {
    this.apiRequest.deleteCategory(catId).subscribe((response: any) => {
      if (response.result) {
        this.getCategories();
      } else {

      }
    })
  }

  saveCategory() {
    this.apiRequest.createCategory(this.categoryForm.value).subscribe((response: any) => {
      if (response.result) {
        this.getCategories();
        this.toggleAddForm();
      } else {

      }
    });
  }
}
