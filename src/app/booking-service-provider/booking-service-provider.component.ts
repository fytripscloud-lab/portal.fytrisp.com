import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { debounceTime, distinctUntilChanged, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '@shared/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ViewDialogComponent } from './dialogs/view-dialog/view-dialog.component';

@Component({
  selector: 'app-booking-service-provider',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, NgClass, FormsModule, MatMenuModule],
  templateUrl: './booking-service-provider.component.html',
  styleUrl: './booking-service-provider.component.scss'
})
export class BookingServiceProviderComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;
  sortColumn: string = 'created_at';
  sortDirection: string = 'desc';
  destination_id: string = '';
  service_provider_type_id: string = '';
  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Service Providers',
      items: ['Home'],
      active: 'Service Providers',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  bookingData: any = [];  
  destinationList: any = [];
  serviceTypeList: any = [];
  searchCtrl = new FormControl('');
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  masterService = inject(MasterService);
  alertService = inject(AlertService);
  private _onDestroy = new Subject<void>();

  constructor(
      private toastr: ToastrService,
      public dialog: MatDialog
  ) { 
  
    }

  ngOnInit(): void {
        this.loadData();    
        this.loadDestinations();
        this.loadServiceType();
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
      this.masterService.getBookingServiceProviderList({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection, destination_id:this.destination_id, service_provider_type_id:this.service_provider_type_id}).subscribe({
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

    loadDestinations() {
      this.isLoading = true;
      this.masterService.getAllDestinationList().subscribe({
        next: (res: any) => {
          this.destinationList = res.data;      
          this.filteredDestinations$.next(res.data);
          this.searchCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(search => {
            if (!search) {
              this.filteredDestinations$.next(this.destinationList.slice());
              return;
            }
            
            // Filter the destinations
            const searchStr = search.toLowerCase();
            const filtered = this.destinationList.filter((destination: { name: string; }) => 
              destination.name.toLowerCase().includes(searchStr)
            );
            this.filteredDestinations$.next(filtered);
          });  
        }
      });
    }

    loadServiceType()
    {
      this.masterService.getBookingServiceProviderType({}).subscribe({
        next: (res: any) => {
          this.serviceTypeList = res.data;
        },
        error: (error) => {
          this.toastr.error(error.error.detail)
          this.isLoading = false;
        }
      });
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

    changeStatus(item_id: any, status: boolean) {
      this.alertService.confirmDialog({
        title: 'Are you sure?',
        text: 'Are you sure you want to update the list status?',
        action: () => this.masterService.changeServiceProviderStatus({id:item_id, is_active:status}).toPromise(),
        successMessage: 'Status updated successfully.'
      }).then(() => {
        this.refresh();
      }).catch((error) => {
        // Error already handled by the service
        console.debug('Operation failed or was cancelled:', error);
      });
    }

    addNew() {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        disableClose: true,
        data: {          
          destinations: this.destinationList,
          serviceType: this.serviceTypeList,
          action: 'add',
        }    
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          // this.showNotification(
          //   'snackbar-success',
          //   'Route added successfully.',
          //   'bottom',
          //   'center'
          // );
          this.toastr.success('Route added successfully.')
          this.refresh();
        }
      });
    }

    editData(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        disableClose: true,
        data: {
          routeList: row,
          destinations: this.destinationList,
          serviceType: this.serviceTypeList,
          action: 'edit',
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
          // this.showNotification(
          //   'snackbar-success',
          //   'Route updated successfully.',
          //   'bottom',
          //   'center'
          // );
          this.toastr.success('Route updated successfully.')
        }
      });
    }

    viewDetails(row: any) {
      const dialogRef = this.dialog.open(ViewDialogComponent, {
        width: '80%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        disableClose: true,
        data: row // Pass the row data to the dialog
      });
    
      dialogRef.afterClosed().subscribe(result => {
        // Handle any actions after dialog is closed if needed
        if (result) {
          // Handle result if needed
        }
      });
    }

    serviceProviderPayment(row:any)
    {
      
    }

}
