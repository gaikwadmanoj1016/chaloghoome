import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Validators } from 'ngx-editor';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { slugify } from '../../utils/slugify';

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
      sectionStyle: new FormControl(''),
      customStyle: new FormControl(''),
    });

    this.getSectionsList();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.sectionForm.reset();
  }

  public getSectionsList() {
    this.apiService.getSectionsAndPostList().subscribe((response) => {
      if (response.result) {
        this.sections = response.data;
        for (let section of this.sections) {
          section.sectionId = slugify(section.sectionName, '-');
        }
      } else {
        this.sections = [];
      }
    })
  }

  saveSection() {
    if (this.sectionForm.valid) {
      const section = this.sectionForm.get('sectionName')?.value;
      const order = this.sectionForm.get('order')?.value;
      const customStyle = this.sectionForm.get('customStyle')?.value;
      const sectionStyle = this.sectionForm.get('sectionStyle')?.value;
      // this.sections.push(section);
      let req: any = {
        "sectionName": section || '',
        "order": order || 0,
        "customStyle": customStyle,
        "sectionStyle": sectionStyle
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
    this.apiService.deleteSection(id).subscribe((response) => {
      if (response.result) {
        this.getSectionsList();
      } else {
        console.error(response.message || 'Something went wrong');
      }
    })
  }
}
