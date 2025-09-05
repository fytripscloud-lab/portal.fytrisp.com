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
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-static-page-seo',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule, MatSelectModule],
  templateUrl: './static-page-seo.component.html',
  styleUrl: './static-page-seo.component.scss'
})
export class StaticPageSeoComponent {

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
      title: 'Static Page SEO',
      items: ['Home'],
      active: 'Static Page SEO',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  pageListData: any = [];  
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,    
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
    this.loadData(1, this.pageSize, searchTerm)
  }
  
  loadData(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.seoMetaTags({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
      next: (res: any) => {
        this.pageListData = res.data;       
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

  addNew() {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '50%',
        maxWidth: '1100px',
        disableClose: true,
        data: {
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
          this.toastr.success('Page added successfully.')
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
          page: row,
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
          this.toastr.success('Page updated successfully.')
        }
      });
    }

    deleteData(reviewId: string) {
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
}
