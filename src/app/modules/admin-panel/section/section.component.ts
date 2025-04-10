import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CommonService } from '../../../services/common.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [SharedModule, NgClass, ReactiveFormsModule, NgFor],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent implements OnInit {
  sectionId: number = 0;
  list: any;
  showHidePostForm: boolean = false;
  postForm: FormGroup;
  selectedImage: string | File | null = null;
  section: any;
  file!: File;
  selectedCard: any;
  cardEditable: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public commonService: CommonService, private fb: FormBuilder, private cdref: ChangeDetectorRef) {
    // Initialize the form
    this.postForm = this.fb.group({
      postName: ['', Validators.required],
      summary: ['', Validators.required],
      location: ['', Validators.required],
      history: [''],
      area: [''],
      yearEstablished: [''],
      specialities: this.fb.array([]),
      famousFor: [''],
      howToGo: [''],
      bestTimeToVisit: [''],
      routes: [''],
      travelGuide: this.fb.array([]),
      isThumbnail: [true]
    });
  }

  ngOnInit(): void {
    console.log(this.route.snapshot.routeConfig?.path?.includes('admin-panel'));
    this.cardEditable = this.route.snapshot.routeConfig?.path?.includes('admin-panel') || false;
    this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
    // this.list = this.commonService.wonders;
    if (this.sectionId) {
      this.getPostBySectionId(this.sectionId);
    }
  }
  navigateTo(path: string) {
    this.commonService.navigateTo(path);
  }

  private getPostBySectionId(sectionId: number) {
    this.apiService.getPostBySectionId(sectionId).subscribe((response) => {
      if (response.result) {
        this.section = response.data;

        if (this.section && this.section.posts && this.section.posts.length > 0) {
          this.section.posts.forEach((item: any) => {
            item.imageUrl = this.commonService.appendAssetUrl(item.thumbnailImg);
          })
        }
        this.commonService.setMetaData(this.section.sectionName);
      } else {
        this.section = [];
      }
    })
  }
  public showHideAddPostForm() {
    this.showHidePostForm = !this.showHidePostForm;
  }

  onEditCard(item: any) {
    // this.selectedCard = item;
    this.apiService.getPostDetails(item.id).subscribe((response: any) => {
      this.selectedCard = response.data;
      this.showHidePostForm = true;
      this.refillPostForm();
    })
  }
  deletePost(item: any) {
    // this.selectedCard = item;
    this.apiService.deletePost(item.id).subscribe((response: any) => {
      if (response.result) {
        console.log("delete successfully");
        this.getPostBySectionId(this.sectionId);
      } else {
        console.error("error deleting post")
      }
    })
  }

  refillPostForm() {
    this.postForm.patchValue({
      postName: this.selectedCard.postName,
      summary: this.selectedCard.summary,
      location: this.selectedCard.location,
      history: this.selectedCard.history,
      area: this.selectedCard.area,
      yearEstablished: this.selectedCard.yearEstablished,
      famousFor: this.selectedCard.famousFor,
      howToGo: this.selectedCard.howToGo,
      bestTimeToVisit: this.selectedCard.bestTimeToVisit,
      routes: this.selectedCard.routes
    });
    if (this.selectedCard.highlights[0]?.imagePath) {
      this.selectedImage = this.commonService.appendAssetUrl(this.selectedCard.highlights[0]?.imagePath);
    }
    // Handle the specialities FormArray
    const specialitiesArray = this.postForm.get('specialities') as FormArray;
    specialitiesArray.clear();

    if (this.selectedCard.specialities && Array.isArray(this.selectedCard.specialities)) {
      this.selectedCard.specialities.forEach((speciality: any) => {
        const specialityGroup = this.fb.group({
          speciality: [speciality.speciality, Validators.required],
          description: [speciality.description],
          isUnique: [speciality.isUnique || false, Validators.required],
          id: [speciality.id],
        });
        specialitiesArray.push(specialityGroup);
      });
    }
    const travelGuideArray = this.postForm.get('travelGuide') as FormArray;
    travelGuideArray.clear();

    if (this.selectedCard.travelGuide && Array.isArray(this.selectedCard.travelGuide)) {
      this.selectedCard.travelGuide.forEach((travelInfo: any) => {
        const travelInfoGroup = this.fb.group({
          title: [travelInfo.title, Validators.required],
          para: [travelInfo.para],
          id: [travelInfo.id],
        });
        travelGuideArray.push(travelInfoGroup);
      });
    }
  }

  closePopup(): void {
    this.showHidePostForm = false;
    this.postForm.reset();
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
      isUnique: ['no', Validators.required],
    });
    this.specialities.push(specialityGroup);
  }

  // Remove a speciality by index
  removeSpecialty(index: number): void {
    this.specialities.removeAt(index);
    this.cdref.detectChanges();
  }

  // onFileSelected(event: Event, field: string): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input?.files?.length) {
  //     this.postForm.get(field)?.setValue(input.files);
  //   }
  // }

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
  async onSubmit(): Promise<void> {
    if (this.postForm.valid) {
      console.log('Form submitted:', this.postForm.value);

      try {
        // Create the formData (await compressing image if available)
        const formData = await this.createFormData();

        // Now, use the formData to send to the backend
        this.apiService.savePost(formData).subscribe((response: any) => {
          if (response.result) {
            this.closePopup();
            this.getPostBySectionId(this.sectionId);
          } else {
            // Handle failure here
          }
        });
      } catch (error) {
        console.error('Error creating form data', error);
      }
    } else {
      alert("Form is not valid");
    }
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
              formData.append(`specialities[${index}].speciality`, speciality.speciality || '');
              formData.append(`specialities[${index}].description`, speciality.description || '');
              formData.append(`specialities[${index}].isUnique`, speciality.isUnique);
              if (speciality.id) {
                formData.append(`specialities[${index}].id`, speciality.id);
              }
            });
          }
          // Handle travel guide (highlights)
          else if (key === 'travelGuide') {
            values[key].forEach((travelInfo: any, index: number) => {
              formData.append(`travelGuide[${index}].title`, travelInfo.title || '');
              formData.append(`travelGuide[${index}].para`, travelInfo.para || '');
              if (travelInfo.id) {
                formData.append(`travelGuide[${index}].id`, travelInfo.id);
              }
            });
          } else {
            formData.append(key, values[key] || '');
          }
        });

        // Add sectionId to formData
        formData.append('sectionId', this.sectionId.toString());
        if (this.selectedCard && Object.keys(this.selectedCard).length > 0) {
          formData.append('id', this.selectedCard.id);
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
  public closeHighlightModal() {
    this.commonService.isAddHighlightModal = false;
  }

  // Example usage
  // const postDTO = {
  //   sectionId: 1,
  //   postName: "Beautiful Beach",
  //   summary: "A serene beach with golden sands.",
  //   location: "California",
  //   history: "This beach has a rich history of fishing.",
  //   area: "500 sq km",
  //   speciality: "Surfing",
  //   famousFor: "Sunsets",
  //   howToGo: "Drive to the coast and follow the signs.",
  //   bestTimeToVisit: "June to August",
  //   routes: "Highway 101",
  //   img: selectedFile, // Single file upload
  //   images: selectedFiles, // Multiple file uploads
  //   highlights: [
  //     { title: "Sunset", description: "Best sunset views" },
  //     { title: "Waves", description: "Perfect for surfing" }
  //   ],
  //   travelGuide: [
  //     { title: "Packing List", para: "Bring sunscreen and swimwear." },
  //     { title: "Local Food", para: "Try the fresh seafood." }
  //   ]
  // };

}
