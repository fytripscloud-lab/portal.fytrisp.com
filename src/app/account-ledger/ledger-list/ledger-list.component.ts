import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MasterService } from '@core/service/master.service';
import { AlertService } from '@shared/alert.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-ledger-list',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatMenuModule],
  templateUrl: './ledger-list.component.html',
  styleUrl: './ledger-list.component.scss'
})
export class LedgerListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  sortColumn: string = 'expense_date';
  sortDirection: string = 'desc';
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;
  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Ledger List',
      items: ['Home'],
      active: 'Ledger List',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  masterService = inject(MasterService);
  dataLists: any = [];
  formDate: string = '';
  toDate: string = '';
  summaryList: any;

  constructor(
      public dialog: MatDialog,
      private alertService: AlertService,
      private toastr: ToastrService,
      private router: Router
    ) {

    }
  
    ngOnInit(): void {
      this.loadData();      
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
      this.masterService.getLedgerList({page, page_size:pageSize, search, from_date:this.formDate, to_date:this.toDate, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
        next: (res: any) => {
          this.dataLists = res.data;
          this.summaryList = res.summary;
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
    
  
  
}
