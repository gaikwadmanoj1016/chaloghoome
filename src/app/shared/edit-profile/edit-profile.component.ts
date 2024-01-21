import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  @Input() isOpen: boolean = false;
  @Output() toggelModal: EventEmitter<any> = new EventEmitter();

  public multipleFiles: File[] = [];
  public uploadedFiles: File[] = [];

  constructor(){}
  closeModal() {
    this.toggelModal.emit(false);
  }
public submit(){
  
}
}
