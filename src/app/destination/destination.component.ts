import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MasterService } from '@core/service/master.service';
import { TableElement, TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { AlertService } from '@shared/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule],
  templateUrl: './destination.component.html',
  styleUrl: './destination.component.scss'
})
export class DestinationComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  sortColumn: string = 'created_at';
  sortDirection: string = 'desc';
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;
  countryList: any = [];

  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Tour Destination',
      items: ['Home'],
      active: 'Tour Destination',
    },
  ];
  fileUrl: string = environment.fileUrl;
  placeholderImage: string = environment.placeholder_image;
  isLoading: boolean = false;
  destinations: any = [];
  masterService = inject(MasterService);

   constructor(
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private alertService: AlertService,
      private toastr: ToastrService,
      private router: Router
    ) { }

  ngOnInit(): void {
    
    this.loadDestinations();
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after last input
      distinctUntilChanged() // Only emit if value changed
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
    this.getCountryList();
  }

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  private performSearch(searchTerm: string) {
    if (!searchTerm) {
      this.loadDestinations(); // Reset to full list if search is empty
      return;
    }

    this.isLoading = true;
    this.loadDestinations(1, this.pageSize, searchTerm)
  }

  loadDestinations(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.tourDestinationList({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
      next: (res: any) => {
        this.destinations = res.data;
        this.dataSource.data = res.data;
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
        //   'Error loading destinations',
        //   'bottom',
        //   'center'
        // );
        this.toastr.error('Error loading destinations', 'Error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getCountryList()
  {
    this.masterService.getCountryList().subscribe((resp:any)=>{
      this.countryList = resp.data;
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
      this.loadDestinations(pageIndex, pageSize);
    }

    getRowNumber(index: number): number {
      return this.pageRow+index+1;
    }

  refresh() {
    this.loadDestinations(this.currentPage+1);
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
      action: () => this.masterService.changeDestinationStatus(item_id, status).toPromise(),
      successMessage: 'Destination status updated successfully.'
    }).then(() => {
      this.refresh();
    }).catch((error) => {
      // Error already handled by the service
      console.debug('Operation failed or was cancelled:', error);
    });
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '80%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        destination: this.destinations,
        countries: this.countryList,
        action: 'add',
      }    
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // this.showNotification(
        //   'snackbar-success',
        //   'Destination added successfully.',
        //   'bottom',
        //   'center'
        // );
        this.toastr.success('Destination added successfully.');
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
        destination: row,
        countries: this.countryList,
        action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
        // this.showNotification(
        //   'snackbar-success',
        //   'Destination updated successfully.',
        //   'bottom',
        //   'center'
        // );
        this.toastr.success('Destination updated successfully.');
      }
    });
  }

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.destinations.map((x:any) => ({
        'Name': x.name,
        'Location': x.search_location,
        'Status': (x.is_active?'Active':'Inactive'),
        'Created At': x.created_at        
      }));

    TableExportUtil.exportToExcel(exportData, 'Destination');
  }

   showNotification(
      colorName: string,
      text: string,
      placementFrom: MatSnackBarVerticalPosition,
      placementAlign: MatSnackBarHorizontalPosition
    ) {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName,
      });
    }

    handleImageError(event: any) {
      event.target.src = this.placeholderImage+'?w=90&h=60';
    }

    manageDestinationRoute(item:any)
    {
      this.router.navigateByUrl('/destination-route?destination_id='+item.id);
    }

    manageHotel(item:any)
    {
      this.router.navigateByUrl('/manage-hotels?destination_id='+item.id);
    }

    manageTripPackage(item:any)
    {
      this.router.navigateByUrl('/trip-packages?destination_id='+item.id);  
    }
}
