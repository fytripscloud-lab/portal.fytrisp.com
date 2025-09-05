import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticated = false;
  private userInfo: any = {};
  private accessToken: string = '';
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshTokenTimeout: any;
  private readonly REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

  constructor(private _http: HttpClient, public router: Router) {
    this.startTokenRefreshTimer();
    this.initializeAuth();
   }

   private initializeAuth() {
    // Check both localStorage and sessionStorage for existing auth
    const accessToken = this.getAccessToken();
    if (accessToken) {
      this.isAuthenticated = true;
      this.loadUserInfo(); // Load user info if token exists
    }
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated && !!this.getAccessToken();
  }
  
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }


  getAccessToken(): string | null {
    return localStorage.getItem(btoa('adminAccessToken'));
  }

  // Store tokens in localStorage
  storeTokens(accessToken: string, refreshToken: any, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    // Store tokens
    localStorage.setItem(btoa('adminAccessToken'), btoa(accessToken));
    if(refreshToken){
      localStorage.setItem(btoa('adminRefreshToken'), btoa(refreshToken));
    }    
    localStorage.setItem('isAdminLoggedIn', 'true');
  }

  async loadUserInfo() {
    try {
      // First try to get from storage
      const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        this.currentUserSubject.next(userData);
        return userData;
      }

      // If not in storage, fetch from API
      const response = await firstValueFrom(
        this._http.get<any>(`${environment.apiUrl}/admin/me`).pipe(
          map(res => res.data)
        )
      );

      // Store in the same storage as the token
      const storage = localStorage.getItem(btoa('adminAccessToken')) 
        ? localStorage 
        : sessionStorage;
      
      storage.setItem('userInfo', JSON.stringify(response));
      this.currentUserSubject.next(response);
      return response;

    } catch (error) {
      console.error('Error loading user info:', error);
      this.refreshToken(); // Logout if we can't load user info
      throw error;
    }
  }

  loadUserData()
  {
    this._http.get<any>(`${environment.apiUrl}/admin/me`).subscribe((res)=>{
      this.currentUserSubject.next(res.data);
    });
  }

  // refreshToken(): Observable<any> {
  //   const refreshToken = localStorage.getItem(btoa('adminRefreshToken')) || 
  //                       sessionStorage.getItem(btoa('adminRefreshToken'));
    
  //   if (!refreshToken) {
  //     return throwError(() => new Error('No refresh token available'));
  //   }

  //   const headers = new HttpHeaders()
  //     .set('Accept', 'application/json');

  //   return this._http.post(
  //     `${environment.apiUrl}/refresh-token`,
  //     { refresh_token: atob(refreshToken) },
  //     { headers }
  //   ).pipe(
  //     tap((response: any) => {
  //       if (response.access_token) {
  //         // Store in same storage as original token
  //         const storage = localStorage.getItem(btoa('adminAccessToken')) 
  //           ? localStorage 
  //           : sessionStorage;
          
  //         this.storeTokens(
  //           response.access_token,
  //           response.refresh_token,
  //           storage === localStorage
  //         );
  //       }
  //     })
  //   );
  // }

  redirectToLogin()
  {
    this.router.navigate(['/authentication/signin']);
  }

  // login(formData:any)
  // {    
  //   let headers = new HttpHeaders()    
  //   .set('Accept', 'application/json');

  //   return this._http.post(environment.apiUrl + '/login', formData, {headers});
  // }

  clearStorage()
  {
    localStorage.removeItem(btoa('adminAccessToken'));
    localStorage.removeItem(btoa('adminRefreshToken'));
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userInfo');
    
    sessionStorage.removeItem(btoa('adminAccessToken'));
    sessionStorage.removeItem(btoa('adminRefreshToken'));
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('userInfo');

    this.isAuthenticated = false;
    this.currentUserSubject.next(null);
  }

  login(formData: any) {
    let headers = new HttpHeaders()
      .set('Accept', 'application/json');

    return this._http.post(`${environment.apiUrl}/admin/login`, formData, { headers })
      .pipe(
        tap((response: any) => {
          if (response.access_token) {
            this.currentUserSubject.next(true);
            this.storeTokens(
              response.access_token,
              response.refresh_token,
              formData.rememberMe // Assuming rememberMe is part of form data
            );
            localStorage.setItem('role_permissions', JSON.stringify(response?.role_permissions));
            this.isAuthenticated = true;
            this.loadUserInfo();
            this.startTokenRefreshTimer();
          }
        })
      );
  }

  logout() {
    this.isAuthenticated = false;
    this.userInfo=null; 
    this.currentUserSubject.next(false);   
    return this._http.delete(environment.apiUrl + '/admin/logout');
    // return of({ success: false });
  }

  logoutAllDevice()
  {
    this.isAuthenticated = false;
    this.userInfo=null;
    this.currentUserSubject.next(false);
    return this._http.delete(environment.apiUrl + '/admin/logout-all-devices');    
  }

  resetPasswordRequest(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Accept', 'application/json');

    return this._http.post(environment.apiUrl + '/admin/request-reset-password', formData, {headers});
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(btoa('adminRefreshToken'));
    
    if (!refreshToken || refreshToken==null || refreshToken==undefined) {
      return throwError(() => new Error('No refresh token available'));
    }

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '+atob(refreshToken));
    const fd = new FormData;

    return this._http.post(`${environment.apiUrl}/admin/refresh-token`, fd, { headers }
    ).pipe(
      tap((response: any) => {
        if (response.access_token) {
          // Store in same storage as original token
          if(response?.role_permissions){
            localStorage.setItem('role_permissions', JSON.stringify(response?.role_permissions));
          }          
          const storage = localStorage.getItem(btoa('adminAccessToken')) 
            ? localStorage 
            : sessionStorage;
          
          this.storeTokens(
            response.access_token,
            atob(refreshToken),
            true
          );
        }
      })
    );
  }

  private startTokenRefreshTimer(): void {
    // Clear any existing timer
    this.stopTokenRefreshTimer();

    // Set up a timer that triggers every 30 minutes
    this.refreshTokenTimeout = setInterval(() => {
      this.refreshToken().subscribe({
        next: () => {
          //console.log('Token refreshed successfully');
        },
        error: (error) => {
          //console.error('Token refresh failed:', error);
          this.handleRefreshError();
        }
      });
    }, this.REFRESH_INTERVAL);
  }

  private stopTokenRefreshTimer(): void {
    if (this.refreshTokenTimeout) {
      clearInterval(this.refreshTokenTimeout);
    }
  }

  private handleRefreshError(): void {
    // Handle refresh token failure (e.g., logout user)
    this.stopTokenRefreshTimer();
    this.logout();
  }
  
  ngOnDestroy(): void {
    this.stopTokenRefreshTimer();
  }
}
