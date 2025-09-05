import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';
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

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss'
})
export class TestimonialComponent {

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
      title: 'Testimonial',
      items: ['Home'],
      active: 'Testimonial',
    },
  ];
  fileUrl: string = environment.fileUrl;
  isLoading: boolean = false;
  testimonialLists: any = [];
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
      this.loadTestimonials();
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
        this.loadTestimonials(); // Reset to full list if search is empty
        return;
      }
  
      this.isLoading = true;
      this.loadTestimonials(1, this.pageSize, searchTerm)
    }
  
    loadTestimonials(page: number = 1, pageSize: number = 10, search='') {
      this.isLoading = true;
      this.masterService.testimonialLists({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
        next: (res: any) => {
          this.testimonialLists = res.data;
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
          //   'Error loading Testimonials',
          //   'bottom',
          //   'center'
          // );
          this.toastr.error('Error loading testimonials', 'Error');
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
        this.loadTestimonials(pageIndex, pageSize);
      }
  
      getRowNumber(index: number): number {
        return this.pageRow+index+1;
      }
  
    refresh() {
      this.loadTestimonials(this.currentPage+1);
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
        action: () => this.masterService.changeTestimonialStatus(item_id, status).toPromise(),
        successMessage: 'Testimonial status updated successfully.'
      }).then(() => {
        this.refresh();
      }).catch((error) => {
        // Error already handled by the service
        console.debug('Operation failed or was cancelled:', error);
      });
    }
  
    addNew() {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '60%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          action: 'add',
        }    
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          // this.showNotification(
          //   'snackbar-success',
          //   'Testimonial added successfully.',
          //   'bottom',
          //   'center'
          // );
          this.toastr.success('Testimonial added successfully.');
          this.refresh();
        }
      });
    }
  
    editCall(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '60%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          testimonial: row,
          action: 'edit',
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
          // this.showNotification(
          //   'snackbar-success',
          //   'Testimonial updated successfully.',
          //   'bottom',
          //   'center'
          // );
          this.toastr.success('Testimonial updated successfully.');
        }
      });
    }

    deleteTestimonial(itemId: string) {
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
          return this.masterService.deleteTestimonial(itemId).toPromise()
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
            'Testimonial has been deleted successfully.',
            'success'
          );
          this.refresh();
        }
      });
    }
  
}
