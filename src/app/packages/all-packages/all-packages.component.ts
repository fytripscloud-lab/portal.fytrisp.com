import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MasterService } from '@core/service/master.service';
import { TableElement, TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AlertService } from '@shared/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-all-packages',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, FeatherIconsComponent, RouterLink, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule],
  templateUrl: './all-packages.component.html',
  styleUrl: './all-packages.component.scss'
})
export class AllPackagesComponent implements OnInit {
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
      title: 'Trip Packages',
      items: ['Home'],
      active: 'Trip Packages',
    },
  ];
  isLoading: boolean = false;
  tourPackageList: any = [];
  destinationList: any = [];
  destinationId: string = '';
  routeId: string = '';
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.destinationId = params['destination_id'];
      this.routeId = params['route_id'];
    });
  }

  ngOnInit(): void {
      this.loadData();
      this.loadDestinations();
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

    deletePackage(packageId: string) {
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
          return this.masterService.deleteTourPackage(packageId).toPromise()
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
            'Package has been deleted successfully.',
            'success'
          );
          this.refresh();
        }
      });
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
      this.masterService.getTourPackages({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection, destination_id:this.destinationId}).subscribe({
        next: (res: any) => {
          this.tourPackageList = res.data;   
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
            'Error loading packages',
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
      this.loadData(this.currentPage+1);
    }
  
    deleteItem(row: any) {
    }

    loadDestinations() {
      this.isLoading = true;
      this.masterService.getAllDestinationList().subscribe({
        next: (res: any) => {
          this.destinationList = res.data;        
        }
      });
    }

    changeStatus(item_id: any, status: boolean) {
      this.alertService.confirmDialog({
        title: 'Are you sure?',
        text: 'Are you sure you want to update the list status?',
        action: () => this.masterService.changeTourPackageStatus(item_id, status).toPromise(),
        successMessage: 'Package status updated successfully.'
      }).then(() => {
        this.refresh();
      }).catch((error) => {
        // Error already handled by the service
        console.debug('Operation failed or was cancelled:', error);
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
        this.destinationId = event.target.value;
        this.loadData();  
      }

      getFormattedDestinations(destinationList: any[]): string {
        if (!destinationList?.length) {
          return 'No destinations';
        }
        
        return destinationList
          .map((item) => item.destination?.name || '')
          .filter(name => name) // Remove empty strings
          .join(', ');
      }


      getFaqList(item:any)
      {
        this.router.navigateByUrl('/trip-faq?package_id='+item.id);
      }
}
