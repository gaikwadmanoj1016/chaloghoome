import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-place-card',
  standalone: false,
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss'
})
export class PlaceCardComponent implements OnInit {
  @Input() item: any;
  @Input() sectionId: any;

  @Input() editable: boolean = false;
  @Output('onNavigateTo') onNavigateTo: EventEmitter<any> = new EventEmitter();
  @Output('onEditClicked') onEditClicked: EventEmitter<any> = new EventEmitter();
  @Output('onDeleteClicked') onDeleteClicked: EventEmitter<any> = new EventEmitter();

  // Context menu properties
  contextMenuVisible: boolean = false;
  selectedItem: any;
  isModalOpen: boolean = false;
  selectedCard: any;

  constructor(public commonService: CommonService) {}

  ngOnInit(): void {    
    this.item.loaded = false;
  }
  
  onImageLoad(item: any) {
    console.log("Image loaded: ", item.location);
    item.loaded = true; // Mark image as loaded
  }
  
  navigateToPostDetails(item: any){
    let path = `place/${item.slugifiedPostName}`;
    this.onNavigateTo.emit(path);
  }
  
  public addHighlighs(item: any) {
    this.commonService.selectedCard = item;
    this.commonService.isAddHighlightModal = true;
  }
  
  public editPlace(item: any) {
    this.onEditClicked.emit(item);
  }

  imageLoaded(event: any){
    this.item.loaded = event;
  }

  // Called when the ellipsis button is right-clicked.
  openContextMenu(item: any): void {
    this.contextMenuVisible = true;
    this.selectedItem = item;
  }

  // Hide context menu when clicking elsewhere on the document
  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  // Called when the Delete option is clicked from the context menu
  deletePlace(item: any) {
    // Implement your delete logic here
    console.log('Deleting:', item);
    // Optionally, hide the menu after clicking
    this.contextMenuVisible = false;
    this.onDeleteClicked.emit(item);
  }
}
