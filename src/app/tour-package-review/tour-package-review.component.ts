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
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AlertService } from '@shared/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ViewDialogComponent } from './dialogs/view-dialog/view-dialog.component';

@Component({
  selector: 'app-tour-package-review',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule, MatSelectModule],
  templateUrl: './tour-package-review.component.html',
  styleUrl: './tour-package-review.component.scss'
})
export class TourPackageReviewComponent {

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
  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Tour Package Review',
      items: ['Home'],
      active: 'Tour Package Review',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  reviewList: any = [];
  tourPackageList: any = [];
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private toastr: ToastrService,
    private router: Router
  ) { 

  }

  ngOnInit(): void {
    this.loadReviewData();
    this.loadAllPackages();
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
      this.loadReviewData(); // Reset to full list if search is empty
      return;
    }

    this.isLoading = true;
    this.loadReviewData(1, this.pageSize, searchTerm)
  }
  
  loadReviewData(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.reviewLists({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
      next: (res: any) => {
        this.reviewList = res.data;       
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

  onPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex + 1; // Convert to 1-based for API
    const pageSize = event.pageSize;
    if(pageIndex>1){
      this.pageRow = this.pageSize*event.pageIndex;
    }else{
      this.pageRow = 0;
    }
    
    this.loadReviewData(pageIndex, pageSize);
  }

  getRowNumber(index: number): number {
    return this.pageRow+index+1;
  }

  refresh() {
    this.loadReviewData(this.currentPage+1);
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

  loadAllPackages(page: number = 1, pageSize: number = 100, search='') {
    this.isLoading = true;
    this.masterService.getTourPackages({page, page_size:pageSize, search}).subscribe({
      next: (res: any) => {
        this.tourPackageList = res.data;
      },
      error: (error) => {
        this.showNotification(
          'snackbar-error',
          'Error loading packages',
          'bottom',
          'center'
        );
      }
    });
  }

  changeStatus(item_id: any, status: boolean) {
    this.alertService.confirmDialog({
      title: 'Are you sure?',
      text: 'Are you sure you want to update the list status?',
      action: () => this.masterService.changeReviewStatus(item_id, status).toPromise(),
      successMessage: 'Review status updated successfully.'
    }).then(() => {
      this.refresh();
    }).catch((error) => {
      // Error already handled by the service
      console.debug('Operation failed or was cancelled:', error);
    });
  }

  addNew() {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '50%',
        maxWidth: '1100px',
        disableClose: true,
        data: {
          packages: this.tourPackageList,
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
          this.toastr.success('Review added successfully.')
          this.refresh();
        }
      });
    }
  
    editCall(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '50%',
        maxWidth: '1100px',
        disableClose: true,
        data: {
          packages: this.tourPackageList,
          review: row,
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

    deleteReview(reviewId: string) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.masterService.deleteReview(reviewId).toPromise()
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error.message}`
              );
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Review has been deleted successfully.',
            'success'
          );
          this.refresh();
        }
      });
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
      event.target.src = this.fileUrl + '/assets/images/placeholder-image.webp?w=90&h=60';
    }

    manageHotel(item:any)
    {
      this.router.navigateByUrl('/manage-hotels?destination_id='+item?.destination?.id+'&route_id='+item.id);
    }

    manageTripPackage(item:any)
    {
      this.router.navigateByUrl('/trip-packages?destination_id='+item?.destination?.id);
    }

    onDestinationChange(event: any) {
      this.loadReviewData();  
    }
}
