import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../service/auth.service';
import { PermissionService } from '@core/service/permission.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router, private permissionService: PermissionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const url = state.url.replace('/', '');
    if (this.authService.isAuthenticatedUser()) {
      return this.authService.currentUser$.pipe(
        map((user:any) => {
          if (user?.user_type === 'superadmin') {
            return true;
          }
          if(this.permissionService.hasPermission(url, 'view')){
            return true;
          }
          if(user?.user_type){
            this.router.navigate(['/unauthorize']);
            return false;
          }          
          return true;
        })
      );
    }
    this.router.navigate(['/authentication/signin']);
    return false;
  }

  private checkUserLoggedIn(): boolean {
    // Add your authentication logic here
    return !!localStorage.getItem(btoa('adminAccessToken')); // Example: Check for a token in localStorage
  }
}
