import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  constructor(public http: HttpClient) {
  }

  public get(url: string, headers?: HttpHeaders, requestOptions?: any): Observable<any> {
    if (requestOptions) {
      return this.http.get(url, requestOptions).pipe(
        map(res => this.parseResponse(res)));
    } else if (headers) {
      return this.http.get(url, {headers: headers}).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    } else {
      return this.http.get(url).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    }
  }


  public post(url: string, data: any, headers?: HttpHeaders): Observable<any> {
    if (headers) {
      return this.http.post(url, data, {headers: headers}).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    } else {
      return this.http.post(url, data).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    }
  }

  public patch(url: string, data: any, headers?: HttpHeaders): Observable<any> {
    if (headers) {
      return this.http.patch(url, data, {headers: headers}).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    } else {
      return this.http.patch(url, data).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    }
  }


  public put(url: string, data: any, headers?: HttpHeaders): Observable<any> {
    if (headers) {
      return this.http.put(url, data, {headers: headers}).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    } else {
      return this.http.put(url, data).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    }
  }

  public delete(url: string, headers?: HttpHeaders, requestOptions?: any): Observable<any> {
    if (requestOptions) {
      return this.http.delete(url, requestOptions).pipe(
        map(res => this.parseResponse(res)));
    } else if (headers) {
      return this.http.delete(url, {headers: headers}).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    } else {
      return this.http.delete(url).pipe(
        map(res => this.parseResponse(res)), catchError(this.handleError), );
    }
  }

  public parseResponse(res: any): any {
    return res ? res : '';
  }
  public handleError(error: any) {
    return observableThrowError(error);
  }
}
