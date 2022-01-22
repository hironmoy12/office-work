
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { EventService } from './event.service';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL: string;
  httpOptions: { headers: HttpHeaders; };
  TOKEN: string;
  ROLE: string;


  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private event: EventService,
    private router: Router
  ) {
    this.ROLE = ''

    this.API_URL = environment.BASE_API_ENDPOINT;
    this.TOKEN = this.storage.getDataField('token');

    this.event.isLogedin.subscribe((res: boolean) => {
      if (res) {
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'multipart/form-data',
            'x-access-token': this.storage.getDataField('token')
          })
        };
      } else {
        this.httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'multipart/form-data',
          })
        };
      }
    });
    if (this.TOKEN) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'multipart/form-data',
          'x-access-token': this.storage.getDataField('token')
        })
      };
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'multipart/form-data',
        })
      };
    }
  }



  private formatErrors(error: any) {
    return throwError(error.error);
  }




  // GET METHOD HTTP REQUEST
  get(path: string, params: HttpParams = new HttpParams()) {
    return this.http.get(`${this.API_URL}${path}`, { headers: this.httpOptions.headers, params })
      .pipe(catchError(this.formatErrors));
  }

  // POST METHOD HTTP REQUEST
  post(path: any, body: object = {}, reportProgress = false) {
    return this.http.post(`${this.API_URL}${path}`, body, { headers: this.httpOptions.headers, reportProgress, })
      .pipe(catchError(this.formatErrors));
  }



  put(path: any, body: object = {}) {
    return this.http.put(`${this.API_URL}${path}`, body, this.httpOptions).pipe(map((r: any) => {
    })).pipe(catchError(this.formatErrors));
  }


  delete(path: string, alert: boolean = false, params: HttpParams = new HttpParams()) {
    return this.http.delete(`${this.API_URL}${path}`, { headers: this.httpOptions.headers, params }).pipe(map((r: any) => {
      if (alert) {
        this.alert(r.message ? r.message : 'Success', 'success');
      }
    })).pipe(catchError(this.formatErrors));
  }

  upload(path: any, body: FormData) {
    return this.http.put(`${this.API_URL}${path}`, body, this.httpOptions).pipe(map((r: any) => {
    })).pipe(catchError(this.formatErrors));
  }


  // SHOW ALERT AS A TOSATER WHEN REQUIRED
  alert(message: string, type: any, duraion?: number) {
    return Swal.fire({
      title: message,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: duraion ? duraion : 5000,
      timerProgressBar: true,
    });
  }

  // SHOW ALERT AS A POPUP WHEN REQUIRED
  alertModal(message: string, type: any, CancelButton = false, isIcon?: boolean) {
    return Swal.fire({
      text: message,
      icon: isIcon ? type : null,
      showConfirmButton: true,
      showCancelButton: CancelButton,
      confirmButtonText: 'Ok'
    });
  }


  // POST HTTP REQUEST WITH FILE UPLOAD
  postMultiData(path: string, file: FormData, reportProgress = false): Observable<any> {
    const httpOptionsimg = {
      headers: new HttpHeaders({
        Accept: 'multipart/form-data',
        'x-access-token': this.storage.getDataField('token')
      }),
      reportProgress
    };
    return this.http.post(`${this.API_URL}${path}`, file, httpOptionsimg)
      .pipe(catchError(this.formatErrors));
  }



}
