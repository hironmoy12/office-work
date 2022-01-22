import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventService } from '../services/event.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private event: EventService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.event.isHttpRequest.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (req.reportProgress && req.method !== 'GET') {
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.event.isProgress.next({
              val: event.total ? Math.round(event.loaded / event.total * 100).toFixed(0) : 0,
              text: 'Downloading', path: req.urlWithParams,
              req: req.url
            });
          }
          if (event.type === HttpEventType.UploadProgress) {
            this.event.isProgress.next({
              val: event.total ? Math.round(event.loaded / event.total * 100).toFixed(0) : 0,
              text: 'Uploading', path: req.urlWithParams,
              req: req.url
            });
          }
          if (event.type === HttpEventType.Response) {
            this.event.isProgress.next(0);
          }
        })
      );
    }

    this.requests.push(req);
    this.event.isHttpRequest.next(true);
    // tslint:disable-next-line: deprecation
    return Observable.create((observer: any) => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
            this.removeRequest(req);
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
