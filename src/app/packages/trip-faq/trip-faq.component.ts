import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from '@core/service/master.service';
import { AlertService } from '@shared/alert.service';
import { ViewDialogComponent } from 'app/query-leads/dialogs/view-dialog/view-dialog.component';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { FormDialogComponent } from '../dialogs/faq-form-dialog/form-dialog.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DatePipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-faq',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule, MatSelectModule, FormsModule],
  templateUrl: './trip-faq.component.html',
  styleUrl: './trip-faq.component.scss'
})
export class TripFaqComponent {

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
      title: 'Tour Package FAQ',
      items: ['Home'],
      active: 'Tour Package FAQ',
    },
  ];
  isLoading: boolean = false;
  faqList: any = [];
  tourPackageList: any = [];
  packageId: string = '';
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.packageId = params['package_id'];   
      if(this.packageId){
        this.loadFaqData();
      }   
    });
  }

  ngOnInit(): void {
    //this.loadFaqData();
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
      this.loadFaqData(); // Reset to full list if search is empty
      return;
    }

    this.isLoading = true;
    this.loadFaqData(1, this.pageSize, searchTerm)
  }

  onPackageChange(event: any) {
    this.packageId = event.target.value;
    this.loadFaqData();
  }
  
  loadFaqData(page: number = 1, pageSize: number = 10, search='') {
    if(this.packageId==''){
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.masterService.faqLists(this.packageId).subscribe({
      next: (res: any) => {
        this.faqList = res.data?.tour_faqs;
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
    
    this.loadFaqData(pageIndex, pageSize);
  }

  getRowNumber(index: number): number {
    return this.pageRow+index+1;
  }

  refresh() {
    this.loadFaqData(this.currentPage+1);
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
        data: {
          packages: this.tourPackageList,
          package_id: this.packageId,
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
          this.toastr.success('FAQ added successfully.');
          this.refresh();        
        }
        if(result==2){
          this.refresh();
          this.addNew();
          
        }
        
      });
    }
  
    editCall(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '50%',
        maxWidth: '1100px',
        data: {
          packages: this.tourPackageList,
          package_id: this.packageId,
          faqs: row,
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
        data: row // Pass the row data to the dialog
      });
    
      dialogRef.afterClosed().subscribe(result => {
        // Handle any actions after dialog is closed if needed
        if (result) {
          // Handle result if needed
        }
      });
    }

    deleteData(faqId: string) {
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
          return this.masterService.deleteTourFaqList(faqId).toPromise()
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
            'FAQ has been deleted successfully.',
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

    onDestinationChange(event: any) {
      this.loadFaqData();  
    }
}
