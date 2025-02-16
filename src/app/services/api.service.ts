import { Injectable } from '@angular/core';
import { HttpRequestsService } from './http-request.service';
import { CommonService } from './common.service';
import { environment } from '../../../environment';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public httpRequest: HttpRequestsService, private commonService: CommonService) { }

  public getPlaceDetails() {
    let API = 'assets/data/place-details.json';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  
  //#region sections
  public getSectionsList() {
    let API = environment.apiUrl + 'api/sections/get';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public saveSection(req: any) {
    let API = environment.apiUrl + 'api/sections/save';
    return this.httpRequest.post(API, req, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  
  //#endregion sections
  
  //#region post
  public getSectionWithPosts() {
    // let API = environment.apiUrl + 'api/posts/getSectionPost/' + sectionId;
    let API = environment.apiUrl + 'api/sections/getSectionWithPosts';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public getPostBySectionId(sectionId: number) {
    // let API = environment.apiUrl + 'api/posts/getSectionPost/' + sectionId;
    let API = environment.apiUrl + 'api/posts/getPostCards/' + sectionId;
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public savePost(formData: FormData) {
    let API = environment.apiUrl + 'api/posts/savePostDetails';
    return this.httpRequest.post(API, formData, this.commonService.getRequestForAttachment()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  
  public getPostDetails(id: number) {
    let API = environment.apiUrl + 'api/posts/getPostDetails/'+id;
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public deletePost(id: number) {
    let API = environment.apiUrl + 'api/posts/delete/'+id;
    return this.httpRequest.delete(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  //#endregion post
}
