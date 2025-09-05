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
import { environment } from 'environments/environment';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '@shared/alert.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {

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
      title: 'Travel Category',
      items: ['Home'],
      active: 'Travel Category',
    },
  ];
  fileUrl: string = environment.fileUrl;
  placeholderImage: string = environment.placeholder_image;
  isLoading: boolean = false;
  categoryLists: any = [];
  masterService = inject(MasterService);

   constructor(
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private toastr: ToastrService,
      private alertService: AlertService
    ) { }

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
    this.masterService.getTourCategoryList({page, page_size:pageSize, search,sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
      next: (res: any) => {
        this.categoryLists = res.data;
        this.dataSource.data = res.data;
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
        this.showNotification(
          'snackbar-error',
          'Error loading destinations',
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
        categoryies: this.categoryLists,
        action: 'add',
      }    
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
        // this.showNotification(
        //   'snackbar-success',
        //   'Travel Category added successfully.',
        //   'bottom',
        //   'center'
        // );
        this.toastr.success('Travel Category added successfully.');
      }
    });
  }

  editCall(row: any) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '50%',
      maxWidth: '1100px',
      disableClose: true,
      data: {
        category: row,
        action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
        // this.showNotification(
        //   'snackbar-success',
        //   'Travel Category updated successfully.',
        //   'bottom',
        //   'center'
        // );
        this.toastr.success('Travel Category updated successfully.');
      }
    });
  }

  deleteItem(row: any) {
  }

  changeStatus(item_id: any, status: boolean) {
    this.alertService.confirmDialog({
      title: 'Are you sure?',
      text: 'Are you sure you want to update the list status?',
      action: () => this.masterService.changeCategoryStatus(item_id, status).toPromise(),
      successMessage: 'Travel Category status updated successfully.'
    }).then(() => {
      this.refresh();
    }).catch((error) => {
      // Error already handled by the service
      console.debug('Operation failed or was cancelled:', error);
    });
  }

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.categoryLists.map((x:any) => ({
        'Image': x.file_path,
        'Name': x.name,
        'Description': x.description,
        'Status': (x.is_active?'Active':'Inactive'),
        'Created At': x.created_at        
      }));

    TableExportUtil.exportToExcel(exportData, 'Tour_Category');
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
}
