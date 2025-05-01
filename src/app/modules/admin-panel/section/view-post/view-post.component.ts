import { PlaceDetailsComponent } from "../../../landing-page/place-list/place-details/place-details.component";
import { PlaceDetailsNewComponent } from '../../../landing-page/place-list/place-details-new/place-details-new.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { convertSlugToNormal, slugify } from "../../../../utils/slugify";
import { ApiService } from "../../../../services/api.service";
import { CommonService } from "../../../../services/common.service";
import { SharedModule } from "../../../../shared/shared.module";
import { AddPostComponent } from "./add-post/add-post.component";

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, AddPostComponent, RouterLink],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss'
})
export class ViewPostComponent {
  sectionId?: number = 0;
  list: any;
  showHidePostForm: boolean = false;
  section: any;
  // selectedCard: any;
  cardEditable: boolean = false;
  sectionName: string = '';
  convertSlugToNormal = convertSlugToNormal;
  slugify = slugify;
  selectedCard: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public commonService: CommonService, private cdref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.cardEditable = this.route.snapshot.routeConfig?.path?.includes('sections') || false;
    this.route.params.subscribe(params => {
      if (params && params['sectionName']) {
        this.sectionName = params['sectionName'];
      } else {
        this.sectionName = this.route.snapshot.paramMap.get('sectionName') || '';
      }
      this.findSectionId();
    });
  }

  public findSectionId() {
    let tempSections = localStorage.getItem('sections');
    console.log(tempSections, this.commonService.sections);

    if (tempSections) {
      let sections = JSON.parse(tempSections);
      console.log(sections);
      this.sectionId = sections.find((item: any) => item.sectionId === this.sectionName)?.id;
    } else if (this.commonService.sections && this.commonService.sections.length > 0) {
      let sections = this.commonService.sections;
      console.log(sections);
      this.sectionId = sections.find((item: any) => item.sectionId === this.sectionName)?.id;
    }
    // this.getSectionList();
    this.getPostBySectionId(this.sectionId);
    this.commonService.isSidebarOpen.set(false);
  }
  // public getSectionList() {
  //   console.log("inside the get section method ");

  //   this.apiService.getSectionsAndPostList().subscribe((response: any) => {
  //     if (response.result) {
  //       this.commonService.sections = response.data.map((item: any) => {
  //         item.sectionId = slugify(item.sectionName, '-');
  //         return item;
  //       });
  //       console.log("section list : ", this.commonService.sections);

  //       localStorage.setItem('sections', JSON.stringify(this.commonService.sections));
  //       this.sectionId = this.commonService.sections.find((item: any) => item.sectionId === this.sectionName)?.id;
  //       // this.list = this.commonService.wonders;
  //       console.log("section id : ", this.sectionId);

  //       this.getPostBySectionId(this.sectionId);
  //     } else {
  //       console.error(response.message || "something went wrong");
  //     }
  //   });
  // }

  navigateTo(path: string) {
    this.commonService.navigateTo(path);
  }

  private getPostBySectionId(sectionId?: number) {
    if (sectionId) {
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
  }
  public showHideAddPostForm() {
    this.showHidePostForm = !this.showHidePostForm;
  }
  public closePostPopup() {
    this.showHidePostForm = false;
  }
  public onPostUpdate() {
    this.getPostBySectionId(this.sectionId);
  }

  onEditCard(item: any) {
    // this.selectedCard = item;
    let query = `id=${item.id}`;
    this.apiService.getPostDetails(query).subscribe((response: any) => {
      if (response.result) {
        this.selectedCard = response.data;
        this.showHidePostForm = true;
      } else {

      }
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
