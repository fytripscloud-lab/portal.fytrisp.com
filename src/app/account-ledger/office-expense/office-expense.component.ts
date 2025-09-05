import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MasterService } from '@core/service/master.service';
import { TableElement, TableExportUtil } from '@shared';
import { AlertService } from '@shared/alert.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-office-expense',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatMenuModule],
  templateUrl: './office-expense.component.html',
  styleUrl: './office-expense.component.scss'
})
export class OfficeExpenseComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  sortColumn: string = 'id';
  sortDirection: string = 'desc';
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;
  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Office Expense',
      items: ['Home'],
      active: 'Office Expense',
    },
  ];
  fileUrl: string = environment.fileUrl
  apiUrl: string = environment.apiUrl;
  isLoading: boolean = false;
  masterService = inject(MasterService);
  dataLists: any = [];
  formDate: string = '';
  toDate: string = '';
  expenceCategories: any = [];

  constructor(
      public dialog: MatDialog,
      private alertService: AlertService,
      private toastr: ToastrService,
      private router: Router
    ) {

    }
  
    ngOnInit(): void {
      this.loadData();
      this.getOfficeExpenseCategories();
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
      // Assuming your API accepts a search parameter
      this.loadData(1, this.pageSize, searchTerm)
    }

    
    loadData(page: number = 1, pageSize: number = 10, search='') {
      this.isLoading = true;
      this.masterService.getOfficeExpenseList({page, page_size:pageSize, search, from_date:this.formDate, to_date:this.toDate, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
        next: (res: any) => {
          this.dataLists = res.data;            
          this.totalPages = res.pagination.total_pages;
  
          this.totalItems = res.pagination.total_items;
          this.currentPage = res.pagination.current_page - 1; // Convert to 0-based
          this.pageSize = res.pagination.page_size;
  
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
          //   'Error loading hotel',
          //   'bottom',
          //   'center'
          // );
          this.toastr.error(error.error.detail);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

    getOfficeExpenseCategories()
    {
      this.masterService.getExpenseCategory().subscribe({
        next: (res: any) => {
          this.expenceCategories = res.data;
        },
        error: (error) => {
          this.toastr.error(error.error.detail);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
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
  
    getRowNumber(index: number): number {
      return this.pageRow+index+1;
    }
  
    refresh() {
      this.loadData(this.currentPage+1);
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
  
    changeStatus(item_id: any, status: boolean) {
      this.alertService.confirmDialog({
        title: 'Are you sure?',
        text: 'Are you sure you want to update the list status?',
        action: () => this.masterService.changePromocodeStatus(item_id, status).toPromise(),
        successMessage: 'Status updated successfully.'
      }).then(() => {
        this.refresh();
      }).catch((error) => {
        // Error already handled by the service
        console.debug('Operation failed or was cancelled:', error);
      });
    }

    viewDetails(row: any) {
      // const dialogRef = this.dialog.open(ViewDialogComponent, {
      //   width: '80%',
      //   maxWidth: '1100px',
      //   maxHeight: '90vh',
      //   disableClose: true,
      //   data: row // Pass the row data to the dialog
      // });
    
      // dialogRef.afterClosed().subscribe(result => {
      //   // Handle any actions after dialog is closed if needed
      //   if (result) {
      //     // Handle result if needed
      //   }
      // });
    }
  
    addNew() {
        const dialogRef = this.dialog.open(FormDialogComponent, {
          width: '60%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          disableClose: true,
          data: {              
            action: 'add',
            expenseCategory: this.expenceCategories
          }    
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 1) {
            this.refresh();
            this.toastr.success('Data added successfully.')
            this.refresh();
          }
        });
      }
    
      editCall(row: any) {
        const dialogRef = this.dialog.open(FormDialogComponent, {
          width: '80%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          disableClose: true,
          data: {
            row: row,
            action: 'edit',
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 1) {
            this.refresh();
            this.toastr.success('Data updated successfully.');
          }
        });
      }
    
      exportExcel() {
        // key name with space add in brackets
        const exportData: Partial<TableElement>[] =
          this.dataLists.map((x:any) => ({
            'Hotel Name': x.hotel_name,
            'Route': x.route.route_name,
            'Status': (x.is_active?'Active':'Inactive'),
            'Created At': x.created_at        
          }));
    
        TableExportUtil.exportToExcel(exportData, 'Hotels');
      }
  
      handleImageError(event: any) {
        event.target.src = this.fileUrl + '/assets/images/placeholder-image.webp';
      }

      downloadVoucher(id:any)
      {
        window.open(this.apiUrl + '/admin/ledger/office-expense/download-voucher/'+id, '_blank');
      }
}
