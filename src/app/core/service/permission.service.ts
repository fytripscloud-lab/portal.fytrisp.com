import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class PermissionService {
  private permissions = new BehaviorSubject<any[]>([]);
  permissions$ = this.permissions.asObservable();

  constructor() {}

  setPermissions(data: any[]) {
    this.permissions.next(data);
  }

  getPermissions() {
    return this.permissions.getValue();
  }

  hasPermission(url: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean {
  // Remove domain part if present
  const cleanUrl = this.removeProtocolAndDomain(url);
  
  // Find permission that matches the URL or is a parent path of the URL
  const perm = this.permissions.getValue().find((p) => {
    const menuUrl = p.menu.url;
    
    // Exact match
    if (cleanUrl === menuUrl) return true;
    
    // Check if menuUrl is a parent path of the current URL
    // For example, if menuUrl is 'trip-packages' and URL is 'trip-packages/edit/123'
    if (cleanUrl.startsWith(menuUrl + '/')) return true;
    
    return false;
  });
  
  return perm ? perm[`can_${action}`] : false;
}

private removeProtocolAndDomain(url: string): string {
  // Handle full URLs with domain
  if (url.includes('://')) {
    // Extract path part after domain
    const urlParts = url.split('/');
    // Remove protocol and domain parts
    return urlParts.slice(3).join('/');
  }
  
  // Already a relative path
  return url;
}
}
