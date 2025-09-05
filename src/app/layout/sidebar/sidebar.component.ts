import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
import { PermissionService } from '@core/service/permission.service';
import { MasterService } from '@core/service/master.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    RouterLinkActive,
    NgClass,
  ],
})
export class SidebarComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {
  imgUrl: string = environment.imgUrl;
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: any;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  userInfo: any = {};
  dashboardData: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private permissionService: PermissionService,
    private masterService: MasterService
  ) {
    super();
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
    this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.authService.currentUser$.subscribe(
      user => {
        this.userInfo = user;
      }
    );
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }
  ngOnInit() {
     // Subscribe to auth changes
    //  this.subs.sink = this.authService.currentUser$.subscribe(
    //   (isAuthenticated) => {
    //     if (isAuthenticated) {
    //       this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    //       this.initLeftSidebar();
    //     } else {
    //       this.sidebarItems = [];
    //     }
    //   }
    // );
    
    // this.permissionService.permissions$.subscribe(permissions => {
    //   console.log(permissions);
    //   this.sidebarItems = ROUTES.filter((sidebarItem) => 
    //     permissions.some(permission => 
    //       permission.menu.url === sidebarItem.path && 
    //       permission.can_view
    //     )
    //   );
    // });    
    //this.initLeftSidebar();
    //this.userInfo = this.authService.currentUserValue;  
    this.loadDashboardData();  
    setInterval(() => {
      this.loadDashboardData();
    }, 300000); // 5 minutes
    
  }
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height;    
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  checkMenuVisible(url:string){
    if(this.userInfo?.user_type=='superadmin'){
      return true;
    }
    if(url=='dashboard/main'){
      return true;
    }
    return this.permissionService.hasPermission(url, 'view');
  }

  checkSubMenuVisible(submenu: any[]) {
    if(this.userInfo?.user_type=='superadmin'){
      return true;
    }
    return submenu.some(menu => 
      this.permissionService.hasPermission(menu?.path, 'view')
    );
  }

  loadDashboardData() {
    this.masterService.getDashboardData().subscribe({
      next: (data: any) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    });
  }

  override ngOnDestroy() {
    // Clean up subscription
    // if (this.userInfo) {
    //   this.userInfo.unsubscribe();
    // }
  }
}
