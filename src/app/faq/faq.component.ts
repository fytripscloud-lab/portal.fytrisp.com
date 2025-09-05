import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '@shared/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
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
      title: 'FAQ',
      items: ['Home'],
      active: 'FAQ',
    },
  ];
  fileUrl: string = environment.fileUrl;
  placeholderImage: string = environment.placeholder_image;
  isLoading: boolean = false;
  faqLists: any = [];
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadFaqData();
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
    // Assuming your API accepts a search parameter
    this.loadFaqData(1, this.pageSize, searchTerm)
  }

  loadFaqData(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.getFaqList({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
      next: (res: any) => {
        this.faqLists = res.data;
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
        this.showNotification(
          'snackbar-error',
          'Error loading faq',
          'bottom',
          'center'
        );
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

  refresh() {
    this.loadFaqData(this.currentPage+1);
  }

  changeStatus(item_id: any, status: boolean) {
    this.alertService.confirmDialog({
      title: 'Are you sure?',
      text: 'Are you sure you want to update the list status?',
      action: () => this.masterService.changeFaqStatus(item_id, status).toPromise(),
      successMessage: 'FAQ status updated successfully.'
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
          action: 'add',
        }    
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
          this.showNotification(
            'snackbar-success',
            'FAQ added successfully.',
            'bottom',
            'center'
          );
          this.refresh();
        }
      });
    }
  
    editFaq(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '80%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          faqs: row,
          action: 'edit',
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
          this.showNotification(
            'snackbar-success',
            'FAQ updated successfully.',
            'bottom',
            'center'
          );
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
    event.target.src = this.placeholderImage+'?im=Resize=(90,60)';
  }

  deleteFaq(itemId: string) {
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
          return this.masterService.deleteFaq(itemId).toPromise()
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
}
