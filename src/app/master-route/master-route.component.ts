import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MasterService } from '@core/service/master.service';
import { TableElement, TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { debounceTime, distinctUntilChanged, ReplaySubject, Subject, takeUntil } from 'rxjs';
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-master-route',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, FeatherIconsComponent, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule, MatSelectModule, NgxMatSelectSearchModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './master-route.component.html',
  styleUrl: './master-route.component.scss'
})
export class MasterRouteComponent implements OnInit {

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
      title: 'Destination Route',
      items: ['Home'],
      active: 'Destination Route',
    },
  ];
  fileUrl: string = environment.fileUrl
  isLoading: boolean = false;
  routeLists: any = [];
  destinationList: any = [];
  destinationId: string = '';
  masterService = inject(MasterService);
  searchCtrl = new FormControl('');
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('searchInput') searchInput!: ElementRef;
  private _onDestroy = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.destinationId = params['destination_id'];
    });
  }

  ngOnInit(): void {
    this.loadRouteData();
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

  private performSearch(searchTerm: string) {
    if (!searchTerm) {
      this.loadRouteData(); // Reset to full list if search is empty
      return;
    }

    this.isLoading = true;
    this.loadRouteData(1, this.pageSize, searchTerm)
  }
  
  loadRouteData(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.masterRouteList({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection, destination_id:this.destinationId}).subscribe({
      next: (res: any) => {
        this.routeLists = res.data;       
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
    
    this.loadRouteData(pageIndex, pageSize);
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

  getRowNumber(index: number): number {
    return this.pageRow+index+1;
  }

  refresh() {
    this.loadRouteData(this.currentPage+1);
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
      action: () => this.masterService.changeRouteStatus(item_id, status).toPromise(),
      successMessage: 'Route status updated successfully.'
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
          destinationId: this.destinationId,
          destinations: this.destinationList,
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
  
    editCall(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        disableClose: true,
        data: {
          routeList: row,
          destinations: this.destinationList,
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
  
    exportExcel() {
      // key name with space add in brackets
      const exportData: Partial<TableElement>[] =
        this.routeLists.map((x:any) => ({
          'Route': x.route_name,
          'Destination': x.destination?.name,
          'Status': (x.is_active?'Active':'Inactive'),
          'Created At': x.created_at        
        }));
  
      TableExportUtil.exportToExcel(exportData, 'Route');
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
      this.destinationId = event.target.value;
      this.loadRouteData();  
    }
}
