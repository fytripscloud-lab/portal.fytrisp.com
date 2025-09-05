import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '@shared/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { RolePermissionDialogComponent } from './dialogs/role-permission-dialog/role-permission-dialog.component';
import { ChangePasswordComponent } from './dialogs/change-password/change-password.component';
import { LoginHistoryDialogComponent } from './dialogs/login-history-dialog/login-history-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;
  sortColumn: string = 'created_at';
  sortDirection: string = 'desc';

  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Admin Users',
      items: ['Home'],
      active: 'Admin Users',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  pageListData: any = [];  
  menuLists: any = [];
  masterService = inject(MasterService);
  alertService = inject(AlertService);

   constructor(
      private toastr: ToastrService,
      public dialog: MatDialog,
    ) { 
  
    }

  ngOnInit(): void {
      this.loadData();    
      this.getMenuLists();
      this.searchSubject.pipe(
        debounceTime(300), // Wait 300ms after last input
        distinctUntilChanged() // Only emit if value changed
      ).subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
    }
  
    onSearch(searchTerm: string) {
      this.searchSubject.next(searchTerm);
    }
  
    private performSearch(searchTerm: string) {
      if (!searchTerm) {
        this.loadData(); // Reset to full list if search is empty
        return;
      }
  
      this.isLoading = true;
      this.loadData(1, this.pageSize, searchTerm)
    }
    
    loadData(page: number = 1, pageSize: number = 10, search='') {
      this.isLoading = true;
      this.masterService.getAdminUserLists({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
        next: (res: any) => {
          this.pageListData = res.data;
          this.totalPages = res.pagination?.total_pages;
  
          this.totalItems = res.pagination?.total_items;
          this.currentPage = res.pagination?.current_page - 1; // Convert to 0-based
          this.pageSize = res.pagination?.page_size;
          
  
          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = this.currentPage;
              this.paginator.pageSize = this.pageSize;
              this.paginator.length = this.totalItems;
            }
          });
        },
        error: (error) => {
          // this.showNotification(
          //   'snackbar-error',
          //   'Error loading route',
          //   'bottom',
          //   'center'
          // );
          this.toastr.error(error.error.detail)
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

    sort(column: string) {
      if (this.sortColumn === column) {
        // Toggle direction if clicking the same column
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Set new column and default to ascending
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
      
      this.refresh();
    }
  
    onPageChange(event: PageEvent) {
      const pageIndex = event.pageIndex + 1; // Convert to 1-based for API
      const pageSize = event.pageSize;
      if(pageIndex>1){
        this.pageRow = this.pageSize*event.pageIndex;
      }else{
        this.pageRow = 0;
      }
      
      this.loadData(pageIndex, pageSize);
    }

    changeStatus(item_id: any, status: boolean) {
      this.alertService.confirmDialog({
        title: 'Are you sure?',
        text: 'Are you sure you want to update the list status?',
        action: () => this.masterService.changeAdminUserStatus(item_id, status).toPromise(),
        successMessage: 'User status updated successfully.'
      }).then(() => {
        this.refresh();
      }).catch((error) => {
        // Error already handled by the service
        console.debug('Operation failed or was cancelled:', error);
      });
    }
  
    getRowNumber(index: number): number {
      return this.pageRow+index+1;
    }
  
    refresh() {
      this.loadData(this.currentPage+1);
    }

    addUserDialog()
    {
      const dialogRef = this.dialog.open(FormDialogComponent, {
          width: '40%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          data: {
            action: 'add',
          }    
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.user_id) {
            this.refresh();
            this.toastr.success('User added successfully.');
            this.setRolePermission(result?.user_id);
          }
        });
    }

    setRolePermission(userId:string)
    {
      const dialogRef = this.dialog.open(RolePermissionDialogComponent, {
        width: '50%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        data: {
          user_id: userId,
          menu_lists: this.menuLists
        }    
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.toastr.success(result);
      });
    }

    getMenuLists()
    {
      this.masterService.getMenuLists().subscribe({
        next: (res: any) => {
          this.menuLists = res.data;
        },
        error: (error) => {
          this.toastr.error(error.error.detail)
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

    changePassword(userId:string)
    {
      const dialogRef = this.dialog.open(ChangePasswordComponent, {
        width: '40%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        data: {
          user_id: userId          
        }    
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.toastr.success('Password updated successfully.');
        }
      });
    }

    getLoginHistory(user_id:any)
    {
      const dialogRef = this.dialog.open(LoginHistoryDialogComponent, {
        width: '80%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        data: {
          user_id: user_id
        }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        // Handle any actions after dialog is closed if needed
        if (result) {
          // Handle result if needed
        }
      });
    }
}
