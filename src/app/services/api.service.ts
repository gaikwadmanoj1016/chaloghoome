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

  // common
  public getAllSugestions() {
    let API = environment.apiUrl + 'api/setup/init';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public getMasterTagList() {
    let API = environment.apiUrl + 'api/setup/getMasterTagList';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public createTag(req: any) {
    let API = environment.apiUrl + 'api/setup/createTag';
    return this.httpRequest.post(API, req, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public deleteTag(tagId: number) {
    let API = environment.apiUrl + 'api/setup/deleteTag/' + tagId;
    return this.httpRequest.delete(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public getMasterCategoryList() {
    let API = environment.apiUrl + 'api/setup/getMasterCategoryList';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public deleteCategory(id: number) {
    let API = environment.apiUrl + 'api/setup/deleteCategory/' + id;
    return this.httpRequest.delete(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public createCategory(req: any) {
    let API = environment.apiUrl + 'api/setup/createCategory';
    return this.httpRequest.post(API, req, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  // common

  //#region sections
  public getSectionsList() {
    let API = environment.apiUrl + 'api/sections/getSectionList';
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public getSectionsAndPostList() {
    let API = environment.apiUrl + 'api/sections/getSectionList';
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
  public deleteSection(id: number) {
    let API = environment.apiUrl + 'api/sections/delete/' + id;
    return this.httpRequest.delete(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }

  //#endregion sections

  //#region post
  public getSectionWithPosts(limit: number) {
    // let API = environment.apiUrl + 'api/posts/getSectionPost/' + sectionId;
    // let API = environment.apiUrl + 'api/sections/getSectionWithPosts';
    let API = environment.apiUrl + 'api/sections/getSectionWithPaginatedPosts?page=0&size=' + limit;
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

  public getPostDetails(query: string) {
    let API = environment.apiUrl + 'api/posts/getPostDetails?' + query;
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public searchPlaces(query: string) {
    let API = environment.apiUrl + `api/posts/search/${query}`;
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public deletePost(id: number) {
    let API = environment.apiUrl + 'api/posts/delete/' + id;
    return this.httpRequest.delete(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }

  public getHighlights(postId: number) {
    let API = environment.apiUrl + 'api/posts/getHighlights/' + postId;
    return this.httpRequest.get(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public deleteHighlight(id: number) {
    let API = environment.apiUrl + 'api/posts/deleteHighlight/' + id;
    return this.httpRequest.delete(API, this.commonService.getRequestOptionArgs()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }
  public saveHighlight(highlight: any) {
    let API = environment.apiUrl + 'api/posts/saveHighlights';
    return this.httpRequest.put(API, highlight, this.commonService.getRequestForAttachment()).pipe(
      map((data) => {
        return data;
      }), catchError((error) => {
        return throwError(() => new Error(error));
      })
    )
  }


  //#endregion post
}
