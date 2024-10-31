import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './service/auth.service';
import { Observable, tap } from 'rxjs';


// import { Error500, Error400, Error409 } from '../../common/app/app.interfaces';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private cookieService: CookieService,
              private authService: AuthService) {}

    // private handleError(err: HttpErrorResponse): Observable<any> {
    //     let errorMsg;
    //     if (err.status === 404 || err.status === 403 || err.status === 401) {
    //         // this.injector.get(UserService).purgeAuth();
    //         // this.injector.get(ToasterService).showError(`Unauthorized`, errorMsg);
    //         this.injector.get(Router).navigate(['/login']);
    //     } else if (err.error instanceof Error) {
    //         // A client-side or network error occurred. Handle it accordingly.
    //         errorMsg = `An error occurred: ${err.error.message}`;
    //     } else {
    //         // The backend returned an unsuccessful response code.
    //         // The response body may contain clues as to what went wrong,
    //         errorMsg = `Backend returned code ${err.status}, body was: ${err.error}`;
    //         console.error(errorMsg);
    //     }
    //     return Observable.throw(errorMsg);
    // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.cookieService.get('token');
    const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

    if (request.body) {
      const newBody = request.body;
      Object.keys(newBody).forEach(key => {
        if (newBody[key] === undefined || newBody[key] === 'undefined' || newBody[key] === 'null') {
          // delete newBody[key];
          newBody[key] = null;
        }
      });
      request = request.clone({
        headers: headers,
        body: newBody
      });
    } else {
      request = request.clone({
        headers: headers
      });
    }

    return next.handle(request).pipe(
        tap(event => {
        //   if (event instanceof HttpResponse) {
        //     const elapsed = Date.now() - started;
        //     console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        //   }
        }, error => {
            // this.handleError(error);
            if (error instanceof HttpErrorResponse) {
              if (this.router.url !== '/authentication/login' && ((error.status === 403) || (error.status === 401 && token.trim().length === 0))) {
                this.authService.setLoggedIn(false);

                // this.authService.logout();
                // this.router.navigateByUrl('/');
                location.href = '/authentication/login';
              } else {
                // if (error.status === 500) {
                //   const error500 = error.error as Error500;
                //   this.utilsService.showError('common.error.serverCode', `: ${error500.message}`);
                // } else if (error.status === 400) {
                //   const error400 = error.error as Error400;
                //   this.utilsService.showError('common.error.serverCode', `: ${error400.cause.message}`);
                // } else if (error.status === 409) {
                //   const error409 = error.error as Error409;
                //   this.utilsService.showError('common.error.serverCode', `: ${error409.cause.cause.message}`);
                // }
                // this.utilsService.showError('common.error.serverCode', error.status.toString());
                // const errorMsg = `Backend returned code ${error.status}, body was: ${error.message}`;
                // return Observable.throw(errorMsg);
              }
            }
        }));
  }
}
