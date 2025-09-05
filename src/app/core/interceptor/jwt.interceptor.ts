import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = localStorage.getItem(btoa('adminAccessToken')); // Get the current access token

    // If an access token exists, add it to the request headers
    if (accessToken) {
      request = this.addToken(request, atob(accessToken));      
    }

    // Proceed with the request
    /*return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
       // console.log(error);
        // If we receive a 401 (Unauthorized) response, it means the token has expired
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(  // Try to refresh the token
            switchMap((response: any) => {                
              // Store the new tokens              
              
              // Retry the original request with the new access token
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              });
              return next.handle(request); // Retry the request with the new token
            })
          );
        }
        // Throw the error if it's not a 401
        return throwError(() => error);
      })
    );*/
    const urlsToIgnore = [
      '/login',
      'refresh-token',
      'assets/',
    ];

    const shouldIgnoreUrl = (url: string): boolean => {    
      return urlsToIgnore.some(urlToIgnore => url.includes(urlToIgnore));
    };

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Access token expired
          if(!shouldIgnoreUrl(request.url)){
            return this.handle401Error(request, next);
          }else{
            this.authService.logout();
            this.authService.clearStorage();
            return throwError(() => error);
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, accessToken: string) {
    const urlsToIgnore = [
      '/login',
      'refresh-token',
      'assets/',
    ];

    const shouldIgnoreUrl = (url: string): boolean => {    
      return urlsToIgnore.some(urlToIgnore => url.includes(urlToIgnore));
    };

    return request = request.clone({
      setHeaders: (!shouldIgnoreUrl(request.url) && accessToken) ? {
        Authorization: `Bearer ${accessToken}`
      } : {},
    });
  }

  // private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (!this.isRefreshing) {
  //     this.isRefreshing = true;
  //     this.refreshTokenSubject.next(null);

  //     return this.authService.refreshToken().pipe(
  //       switchMap((token: any) => {
  //         this.isRefreshing = false;
  //         this.authService.storeTokens(token.access_token, null, true);
  //         this.refreshTokenSubject.next(token.access_token);
  //         return next.handle(this.addToken(req, token.access_token));
  //       }),
  //       catchError((error) => {
  //         this.isRefreshing = false;
  //         this.authService.logout();
  //         this.authService.clearStorage();    
  //         this.toastr.error('Session Expired');
  //         this.router.navigate(['/authentication/signin']);      
  //         return throwError(() => error);
  //       })
  //     );
  //   } else {
  //     this.authService.logout();
  //     this.authService.clearStorage(); 
  //     this.router.navigate(['/authentication/signin']);
  //     return this.refreshTokenSubject.pipe(
  //       filter(token => token !== null),
  //       take(1),
  //       switchMap((token) => next.handle(this.addToken(req, token!)))
  //     );
      
  //   }
  // }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // reset
  
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.authService.storeTokens(token.access_token, null, true);
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(this.addToken(req, token.access_token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null); // ensure blocked requests are released
          this.authService.logout();
          this.authService.clearStorage();    
          this.toastr.error('Session expired. Please log in again.');
          this.router.navigate(['/authentication/signin']);
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }  
}
