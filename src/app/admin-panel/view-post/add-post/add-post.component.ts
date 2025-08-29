import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from 'ngx-editor';
// import { SharedModule } from '../../../shared/shared.module';
import { CommonService } from '../../../shared/services/common.service';
import { ApiService } from '../../../shared/services/api.service';
import { NgFor } from '@angular/common';
import { slugify } from '../../../utils/slugify';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})
export class AddPostComponent implements OnInit {
  @Input() placeDetails!: any;
  @Input() sectionId!: number;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
  @Output() onPostUpdate: EventEmitter<any> = new EventEmitter();
  postForm: FormGroup = new FormGroup({});
  selectedImage: string | File | null = null;
  file!: File;
  allCategories: any[] = [];
  allTags: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  // selctionExist: boolean = false;
  isEditing: boolean = false;
  // Selected
  categories: any[] = [];
  tags: any[] = [];

  // Filtered suggestions

  // category
  filteredCategories: any[] = [];
  showCategoryModal = signal(false);
  searchCategory: string = '';
  tempCategorySelected: any[] = [];

  // tags
  filteredTags: any[] = [];
  showTagModal = signal(false);
  searchTag: string = '';
  tempTagSelected: any[] = [];
  readonly LOCAL_STORAGE_DRAFT_KEY = 'postFormDraft';
  message: string = '';
  draftDataRestored: boolean = false;
  skipNextSave: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, public commonService: CommonService, private apiService: ApiService, private cdref: ChangeDetectorRef) {
    commonService.headerName = 'Add New Post';
  }

  ngOnInit(): void {
    // Initialize the form
    this.postForm = this.fb.group({
      postName: ['', Validators.required],
      slugifiedPostName: ['', Validators.required],
      summary: ['', Validators.required],
      location: ['', Validators.required],
      countryId: [''],
      stateId: [''],
      cityId: [''],
      history: [''],
      area: [''],
      annualVisitors: [''],
      yearEstablished: [''],
      specialities: this.fb.array([]),
      facts: this.fb.array([]),
      famousFor: [''],
      howToGo: [''],
      bestTimeToVisit: [''],
      routes: [''],
      categories: [''],
      tags: [''],
      travelGuide: this.fb.array([]),
      isThumbnail: [true],
      sectionId: ['']
    });
    // this.restoreDraftIfExists(); // ✅ Restore draft

    // // ✅ Auto-save to localStorage with debounce
    // this.postForm.valueChanges
    //   .pipe(debounceTime(3000), distinctUntilChanged())
    //   .subscribe(formData => {
    //     if (this.skipNextSave) {
    //       this.skipNextSave = false; // reset flag
    //       return; // ⛔ skip saving
    //     }

    //     console.log('Auto-saving to draft...');
    //     this.showMessage('Auto-saving to draft...');
    //     localStorage.setItem(this.LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(formData));
    //   });
    this.getCountryList();
    this.getAllCategory();
    this.getAllTags();
    this.route.params.subscribe((param: any) => {
      if (param && param['id']) {
        let query = `id=${param['id']}`;
        this.isEditing = true;
        this.commonService.headerName = 'Edit New Post';
        this.apiService.getPostDetails(query).subscribe((response: any) => {
          if (response.result) {
            this.placeDetails = response.data;
            this.refillPostForm();
          } else {
            this.placeDetails = undefined;
            console.error("place details not found");
          }
        })
      } else {
        this.isEditing = false;
      }
    });
  }

  refillPostForm() {
    this.postForm.patchValue({
      postName: this.placeDetails.postName,
      slugifiedPostName: '/' + this.placeDetails.slugifiedPostName,
      summary: this.placeDetails.summary || '',
      location: this.placeDetails.location || '',
      history: this.placeDetails.history || '',
      area: this.placeDetails.area || '',
      yearEstablished: this.placeDetails.yearEstablished || '',
      famousFor: this.placeDetails.famousFor || '',
      howToGo: this.placeDetails.howToGo || '',
      bestTimeToVisit: this.placeDetails.bestTimeToVisit || '',
      routes: this.placeDetails.routes || '',
      cityId: this.placeDetails?.city?.cityId || '',
      stateId: this.placeDetails?.city?.stateId || '',
      countryId: this.placeDetails?.city?.countryId || '',
      annualVisitors: this.placeDetails?.annualVisitors || '',
    });
    if (this.placeDetails.highlights[0]?.imagePath) {
      this.selectedImage = this.commonService.appendAssetUrl(this.placeDetails.highlights[0]?.imagePath);
    }
    // Handle the specialities FormArray
    const specialitiesArray = this.postForm.get('specialities') as FormArray;
    specialitiesArray.clear();

    if (this.placeDetails.specialities && Array.isArray(this.placeDetails.specialities)) {
      this.placeDetails.specialities.forEach((speciality: any) => {
        const specialityGroup = this.fb.group({
          speciality: [speciality.speciality, Validators.required],
          description: [speciality.description],
          isUnique: [speciality.isUnique || false, Validators.required],
          id: [speciality.id],
        });
        specialitiesArray.push(specialityGroup);
      });
    }
    const factsArray = this.postForm.get('facts') as FormArray;
    factsArray.clear();

    if (this.placeDetails.facts) {
      this.placeDetails.facts.split('.,').forEach((fact: any) => {
        const factGroup = this.fb.group({
          fact: [fact.endsWith('.') ? fact : fact + '.', Validators.required],
        });
        factsArray.push(factGroup);
      });
    }

    const travelGuideArray = this.postForm.get('travelGuide') as FormArray;
    travelGuideArray.clear();

    if (this.placeDetails.travelGuide && Array.isArray(this.placeDetails.travelGuide)) {
      this.placeDetails.travelGuide.forEach((travelInfo: any) => {
        const travelInfoGroup = this.fb.group({
          title: [travelInfo.title, Validators.required],
          para: [travelInfo.para],
          id: [travelInfo.id],
        });
        travelGuideArray.push(travelInfoGroup);
      });
    }
    if (this.placeDetails?.postTagList && this.placeDetails.postTagList.length > 0) {
      this.tags = this.placeDetails.postTagList;
    }
    if (this.placeDetails?.postCatList && this.placeDetails.postCatList.length > 0) {
      this.categories = this.placeDetails.postCatList.map((item: any) => item.category);
      console.log(this.categories);

    }
    if (this.placeDetails.city && this.placeDetails.city.countryId) {
      this.getStateListByCountry({ target: { value: this.placeDetails.city.countryId } });
      this.getCityListByCountry({ target: { value: this.placeDetails.city.countryId } });
    }
    if (this.placeDetails.city && this.placeDetails.city.stateId) {
      this.getCityListByState({ target: { value: this.placeDetails.city.stateId } });
    }
  }

  // restoreDraftIfExists() {
  //   const savedDraft = localStorage.getItem(this.LOCAL_STORAGE_DRAFT_KEY);
  //   if (savedDraft) {
  //     try {
  //       const parsed = JSON.parse(savedDraft);
  //       this.postForm.patchValue(parsed);
  //       console.log('Draft restored successfully!');
  //       this.draftDataRestored = true;
  //       this.showMessage('Draft restored successfully!')
  //     } catch (err) {
  //       this.draftDataRestored = false;
  //       console.error('Error parsing saved draft:', err);
  //       this.showMessage('Error parsing saved draft:' + err)
  //     }
  //   }
  // }

  async onSubmit(): Promise<void> {
    // if (this.postForm.valid) {
    console.log('Form submitted:', this.postForm.value);

    try {
      // Create the formData (await compressing image if available)
      const formData = await this.createFormData();

      // Now, use the formData to send to the backend
      this.apiService.savePost(formData).subscribe((response: any) => {
        if (response.result) {
          this.closePopup();
          this.onPostUpdate.emit();
        } else {
          // Handle failure here
        }
      });
    } catch (error) {
      console.error('Error creating form data', error);
    }
    // } else {
    //   alert("Form is not valid");
    // }
  }

  createFormData(): Promise<FormData> {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        const values = this.postForm.value;

        // Loop through all form values
        Object.keys(values).forEach((key) => {
          // Handle specialities (which are arrays of objects)
          if (key === 'specialities') {
            values[key].forEach((speciality: any, index: number) => {
              formData.append(`specialities[${index}].speciality`, (speciality.speciality) ? speciality.speciality.trim() : '');
              formData.append(`specialities[${index}].description`, speciality.description ? speciality.description.trim() : '');
              formData.append(`specialities[${index}].isUnique`, speciality.isUnique);
              if (speciality.id) {
                formData.append(`specialities[${index}].id`, speciality.id);
              }
            });
          } else if (key === 'facts') {
            formData.append(`facts`, values[key].map((item: any) => item.fact).join('.,') || '');
          } else if (key === 'travelGuide') {
            values[key].forEach((travelInfo: any, index: number) => {
              formData.append(`travelGuide[${index}].title`, travelInfo.title ? travelInfo.title.trim() : '');
              formData.append(`travelGuide[${index}].para`, travelInfo.para ? travelInfo.para.trim() : '');
              if (travelInfo.id) {
                formData.append(`travelGuide[${index}].id`, travelInfo.id);
              }
            });
          } else if (key === 'tags') {
            this.tags.forEach((tag: any, index: number) => {
              // let tagId = this.allTags?.find((item: any) => item.tagName === tagName)?.id || -1;
              let tagId = tag.id;
              if (tagId > 0) {
                formData.append(`tagList[${index}].id`, tagId);
              } else {
                formData.append(`tagList[${index}].tagName`, tag.tagName ? tag.tagName.trim() : '');
              }
              // formData.append(`tagList[${index}].tagName`, tag || '');
            });
          } else if (key === 'categories') {
            this.categories.forEach((category: any, index: number) => {
              // let catId = this.allCategories?.find((item: any) => item.catName === category)?.id || -1;
              let catId = category.id;
              if (catId && catId > 0) {
                formData.append(`catList[${index}].id`, catId);
              } else {
                formData.append(`catList[${index}].catName`, category.catName ? category.catName.trim() : '');
              }
            });
          } else if (key === 'slugifiedPostName') {
            formData.append('slugifiedPostName', (values[key].startsWith('/') ? values[key].substring(1) : values[key]));
          } else {
            formData.append(key, (typeof values[key] === 'string') ? values[key]?.trim() : values[key] || '');
          }
        });

        // Add sectionId to formData
        if (this.sectionId && !this.isEditing) {
          formData.append('sectionId', this.sectionId.toString());
        }
        if (this.placeDetails && Object.keys(this.placeDetails).length > 0) {
          formData.append('id', this.placeDetails.id);
        }

        // Append both files if available
        if (this.file) {
          // Append original file
          formData.append('img', this.file);

          // Compress the image and append as compressedImg
          const compressedFile = await this.commonService.compressImage(this.file, 0.5); // Scale to 50%
          formData.append('compressedImg', compressedFile);
        }

        resolve(formData);
      } catch (error) {
        reject(error);
      }
    });
  }

  closePopup(): void {
    // this.showHidePostForm = false;
    // this.onCloseModal.emit();
    // this.skipNextSave = true;
    // this.clearDraft();
    this.postForm.reset();
    this.commonService.goBack();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.postForm.patchValue({ image: this.selectedImage });
    }
  }

  get travelGuide(): FormArray {
    return this.postForm.get('travelGuide') as FormArray;
  }

  addHighlight(): void {
    this.travelGuide.push(
      this.fb.group({
        title: ['', Validators.required],
        para: ['', Validators.required]
      })
    );
  }

  removeInfo(index: number): void {
    this.travelGuide.removeAt(index);
    this.cdref.detectChanges();
  }

  // Getter for specialities FormArray
  get specialities(): FormArray {
    return this.postForm.get('specialities') as FormArray;
  }

  // Add a new speciality group
  addSpecialty(): void {
    const specialityGroup = this.fb.group({
      speciality: ['', Validators.required],
      description: [''],
      isUnique: ['false', Validators.required],
    });
    this.specialities.push(specialityGroup);
  }

  // Remove a speciality by index
  removeSpecialty(index: number): void {
    this.specialities.removeAt(index);
    this.cdref.detectChanges();
  }

  // Getter for facts FormArray
  get facts(): FormArray {
    return this.postForm.get('facts') as FormArray;
  }

  // Add a new facts group
  addFact(): void {
    const factGroup = this.fb.group({
      fact: ['', Validators.required]
    });
    this.facts.push(factGroup);
  }

  // Remove a facts by index
  removeFact(index: number): void {
    this.facts.removeAt(index);
    this.cdref.detectChanges();
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.file = file;

      // Check if the selected file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        input.value = ''; // Reset the input
        return;
      }

      // Generate a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string; // Assign the preview URL
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeImage(): void {
    this.selectedImage = null; // Clear the selected image
  }

  getCountryList() {
    this.apiService.getCountryList().subscribe((response: any) => {
      if (response.result) {
        this.countryList = response.data;
      } else {

      }
    })
  }
  getStateListByCountry(e: any) {
    this.apiService.getStateListByCountry(e.target.value).subscribe((response: any) => {
      if (response.result) {
        this.stateList = response.data;
      } else {

      }
    })
  }
  getCityListByState(e: any) {
    this.apiService.getCityListByState(e.target.value).subscribe((response: any) => {
      if (response.result) {
        this.cityList = response.data;
      } else {

      }
    })
  }
  getCityListByCountry(e: any) {
    this.apiService.getCityListByCountry(e.target.value).subscribe((response: any) => {
      if (response.result) {
        this.cityList = response.data;
      } else {

      }
    })
  }

  sortFilteredCategory() {
    const sorted = [...this.filteredCategories].sort((a, b) =>
      a.catName.localeCompare(b.catName)
    );
    this.filteredCategories = sorted;
  }

  sortFilteredTags() {
    const sorted = [...this.filteredTags].sort((a, b) =>
      a.tagName.localeCompare(b.tagName)
    );
    this.filteredCategories = sorted;
  }

  // sortFilteredTags() {
  //   this.filteredTags.sort((a: any,b: any) => {
  //     return a.tagName.localeCompare(b.tagName);
  //   });
  // }
  getAllCategory() {
    this.apiService.getMasterCategoryList().subscribe((response: any) => {
      if (response.result) {
        this.allCategories = response.data;
      } else {

      }
    })
  }
  getAllTags() {
    this.apiService.getMasterTagList().subscribe((response: any) => {
      if (response.result) {
        this.allTags = response.data;
      } else {

      }
    })
  }

  public onPostNameInput(event: any) {
    let text = event.target.value || '';
    this.postForm.patchValue({ slugifiedPostName: '/' + slugify(text) });
  }

  // #region category selection using modal
  filteringCategories(): any[] {
    return this.allCategories.filter(c =>
      c.catName.toLowerCase().includes(this.searchCategory.toLowerCase())
    );
  }

  selectCategory(value: any) {
    if (!this.categories.includes(value)) {
      this.categories.push(value.catName);
    }
    this.postForm.get('categories')?.setValue('');
    this.filteredCategories = [];
  }

  addCategory(event?: any) {
    event?.preventDefault();
    const value = this.postForm.get('categories')?.value.trim();
    if (value && !this.categories.includes(value)) {
      this.categories.push({ catName: value });
    }
    this.postForm.get('categories')?.setValue('');
    this.filteredCategories = [];
  }

  removeCategory(value: string) {
    // this.categories = this.categories.filter(c => c !== value);
    let category = this.placeDetails?.postCatList?.find((t: any) => t.category === value);
    if (category) {
      this.apiService.deletePostCat(category.id).subscribe((response: any) => {
        if (response && response.result) {
          this.categories = this.categories.filter(t => t !== value);
        } else {

        }
      })
    } else {
      this.categories = this.categories.filter(t => t !== value);
    }
  }

  isCategoryChecked(cat: any): boolean {
    return this.tempCategorySelected.some(s => s.catName === cat.catName);
  }

  toggleCategorySelection(cat: any) {
    if (this.isCategoryChecked(cat)) {
      this.tempCategorySelected = this.tempCategorySelected.filter(c => c.catName !== cat.catName);
    } else {
      this.tempCategorySelected.push(cat);
    }
  }

  addCustomCategory() {
    const trimmed = this.searchCategory.trim();
    if (trimmed && !this.tempCategorySelected.find(c => c.catName === trimmed)) {
      this.tempCategorySelected.push({ catName: trimmed });
      this.searchCategory = '';
    }

  }

  openCategoryModal() {
    this.tempCategorySelected = this.categories;
    this.showCategoryModal.set(true);
  }

  updateSelectedCategories() {
    this.categories = this.tempCategorySelected;
    console.log(this.tempCategorySelected);
    this.showCategoryModal.set(false);
  }
  // #endregion category selection using modal


  // #region tags selection using modal
  filteringTags(): any[] {
    return this.allTags.filter(c =>
      c.tagName.toLowerCase().includes(this.searchTag.toLowerCase())
    );
  }

  selectTags(value: any) {
    if (!this.tags.includes(value)) {
      this.tags.push(value.tagName);
    }
    this.postForm.get('tags')?.setValue('');
    this.filteredTags = [];
  }

  isTagChecked(cat: any): boolean {
    return this.tempTagSelected.some(s => s.tagName === cat.tagName);
  }

  toggleTagSelection(cat: any) {
    if (this.isTagChecked(cat)) {
      this.tempTagSelected = this.tempTagSelected.filter(c => c.tagName !== cat.tagName);
    } else {
      this.tempTagSelected.push(cat);
    }
  }

  addCustomTag() {
    const trimmed = this.searchTag.trim();
    if (trimmed && !this.tempTagSelected.find(c => c.tagName === trimmed)) {
      this.tempTagSelected.push({ tagName: trimmed });
      this.searchTag = '';
    }
  }

  openTagModal() {
    this.tempTagSelected = this.tags;
    this.showTagModal.set(true);
  }

  updateSelectedTags() {
    this.tags = this.tempTagSelected;
    console.log(this.tempTagSelected);
    this.showTagModal.set(false);
  }


  filterTags() {
    const input = this.postForm.get('tags')?.value.toLowerCase() || '';
    this.filteredTags = this.allTags
      .filter((t: any) => t.tagName.toLowerCase().includes(input) && !this.tags.includes(t));
    this.sortFilteredTags();
  }

  selectTag(value: any) {
    if (!this.tags.includes(value)) {
      this.tags.push(value.tagName);
    }
    this.postForm.get('tags')?.setValue('');
    this.filteredTags = [];
  }

  addTag(event?: any) {
    event?.preventDefault();
    const value = this.postForm.get('tags')?.value.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push({ tagName: value });
    }
    this.postForm.get('tags')?.setValue('');
    this.filteredTags = [];
  }

  removeTag(value: string) {
    let tag = this.placeDetails?.postTagList?.find((t: any) => t.tagName === value);
    if (tag) {
      this.apiService.deletePostTag(tag.id).subscribe((response: any) => {
        if (response && response.result) {
          this.tags = this.tags.filter(t => t !== value);
        } else {

        }
      })
    } else {
      this.tags = this.tags.filter(t => t !== value);
    }
  }
  // clearDraft() {
  //   localStorage.removeItem(this.LOCAL_STORAGE_DRAFT_KEY);
  // }

  // public showMessage(message: any) {
  //   this.message = message;
  //   setTimeout(() => {
  //     this.message = '';
  //   }, 3000);
  // }
  // #endregion tags selection using modal
}
