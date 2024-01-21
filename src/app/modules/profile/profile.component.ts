import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, ImageCropperModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  isModalOpen: boolean = false;
  public posterUrl: string = '../../../assets/imgs/Dolomites Italy - Best Places To Visit in the Dolomites + 1-Week Itinerary.jpg';
  public profileUrl: string = '../../../assets/imgs/feniglia2.jpg';
  posterDefaultUrl: string = '';
  profileDefaultUrl: string = '';
  profiles: any[] = [
    { id: 1, name: 'John Doe', image: 'assets/avatars/1.jpg' },
    { id: 2, name: 'Jane Smith', image: 'assets/avatars/2.jpg' },
    { id: 3, name: 'Alice Johnson', image: 'assets/avatars/3.jpg' },
    { id: 4, name: 'Bob Williams', image: 'assets/avatars/4.jpg' },
    { id: 5, name: 'Bob Williams', image: 'assets/avatars/5.jpg' },
    { id: 6, name: 'Bob Williams', image: 'assets/avatars/7.jpg' },
  ];
  showModal: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileName: string = '';
  aspectRatio: number = 1;

  // constructor(public dialog: MatDialog) {}

  // openCustomModal(): void {
  //   const dialogRef = this.dialog.open(CustomCropperModalComponent, {
  //     width: '300px',
  //     data: { title: 'Custom Modal', message: 'This is a simple custom modal!' }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  closeModal() {
    // Close the modal
    this.showModal = false;
  }
  uploadPoster(event: any): void {
    this.showModal = true;
    this.fileName = 'poster';
    this.aspectRatio = 3/1;
    this.imageChangedEvent = event;
  }
  uploadProfile(event: any): void {
    this.showModal = true;
    this.fileName = 'profile';
    this.aspectRatio = 1;
    this.imageChangedEvent = event;
  }

  ngOnInit(): void {
    console.log(this.posterUrl);
  }
  onPosterSelected(event: any) {
    // const file: File = event.target.files[0];
    if(this.fileName === 'poster'){
      this.posterUrl = event.filePath;
    }else if(this.fileName === 'profile'){
      this.profileUrl = event.filePath;
    }
    // this.uploadPoster(file);
  }

  openPosterFileInput() {
    // Trigger the hidden file input
    const fileInput = document.getElementById('posterFileInput') as HTMLInputElement;
    fileInput.click();
  }
  onProfileSelected(event: any) {
    const file: File = event.target.files[0];
    this.uploadProfile(file);
  }

  // uploadProfile(file: File) {
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = (e: any) => {
  //       this.profileUrl = e.target.result;
  //     };

  //     // Read the image as a data URL
  //     reader.readAsDataURL(file);
  //   }
  // }

  openProfileFileInput() {
    // Trigger the hidden file input
    const fileInput = document.getElementById('profileFileInput') as HTMLInputElement;
    fileInput.click();
  }
  openModal() {
    this.isModalOpen = true;
  }

  toggleModal(flag: boolean) {
    this.isModalOpen = flag;
  }
}
