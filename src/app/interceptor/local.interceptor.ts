import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable()
export class LocalInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith('https://')) {
      return next.handle(request);
    }
    request = request.clone({
      url: environment.apiUrl + request.url,
      setHeaders: {
        'X-Goog-Authenticated-User-Email': 'conqstephane@gmail.com'
      }
    });
    return next.handle(request);
  }
}
