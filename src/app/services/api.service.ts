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
}
