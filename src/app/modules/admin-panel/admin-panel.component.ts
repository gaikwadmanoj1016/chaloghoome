import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Validators } from 'ngx-editor';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  sections: any[] = [];
  // sections: any[] = [
  //   {name: 'Hidden Gems', sectionOrder: 1, id: 1},
  // ];
  showAddForm = false;
  sectionForm: FormGroup;
  selectedSection: any;

  constructor(public commonService: CommonService, private apiService: ApiService) {
    this.sectionForm = new FormGroup({
      sectionName: new FormControl(''),
      order: new FormControl(0),
    });

    this.getSectionsList();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.sectionForm.reset();
  }

  public getSectionsList() {
    this.apiService.getSectionsList().subscribe((response) => {
      if (response.result) {
        this.sections = response.data;
      } else {
        this.sections = [];
      }
    })
  }

  saveSection() {
    if (this.sectionForm.valid) {
      const section = this.sectionForm.get('sectionName')?.value;
      const order = this.sectionForm.get('order')?.value;
      // this.sections.push(section);
      let req: any = {
        "sectionName": section || '',
        "order": order || 0
      }
      if (this.selectedSection && this.selectedSection.id) {
        req.id = this.selectedSection.id
      }
      this.apiService.saveSection(req).subscribe((response) => {
        if (response.result) {
          this.getSectionsList();
          this.selectedSection = null;
        } else {
          
        }
      })
      this.toggleAddForm();
    }
  }

  editSection(section: any) {
    this.sectionForm.patchValue(section);
    this.selectedSection = section;
    this.showAddForm = true;
  }

  deleteSection(id: number) {
    this.sections = this.sections.filter((section, index) => index !== id);
  }
}
