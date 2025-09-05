import { DatePipe, NgClass, NgIf } from '@angular/common';
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
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '@shared/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-service-type',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, NgClass, FormsModule, MatMenuModule],
  templateUrl: './booking-service-type.component.html',
  styleUrl: './booking-service-type.component.scss'
})
export class BookingServiceTypeComponent {

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
      title: 'Service Type',
      items: ['Home'],
      active: 'Service Type',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  bookingData: any = [];  
  masterService = inject(MasterService);
  alertService = inject(AlertService);

  constructor(
      private toastr: ToastrService,
      public dialog: MatDialog
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
  
  searchData()
  {
    this.loadData();
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
      this.masterService.getBookingServiceProviderType({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
        next: (res: any) => {
          this.bookingData = res.data;
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
  
    getRowNumber(index: number): number {
      return this.pageRow+index+1;
    }
  
    refresh() {
      this.loadData(this.currentPage+1);
    }

    getPaymentStatus(payment_status:string){
      if(payment_status=='partial'){
        return 'bg-primary';
      }
      else if(payment_status=='paid'){
        return 'bg-success';
      }else if(payment_status=='failed'){
        return 'bg-danger';
      }else{
        return 'bg-warning';
      }
    }

    // viewDetails(row: any) {
    //   const dialogRef = this.dialog.open(ViewDialogComponent, {
    //     width: '80%',
    //     maxWidth: '1100px',
    //     maxHeight: '90vh',
    //     data: {
    //       row,
    //       type: 'failed'
    //     }
    //   });
    
    //   dialogRef.afterClosed().subscribe(result => {
    //     // Handle any actions after dialog is closed if needed
    //     if (result.type=='payment') {
    //       this.sendQuotationPayment(result?.row);
    //     }
    //     if (result.type=='cash') {
    //       this.cashPayment(result?.row);
    //     }
    //   });
    // }


}
