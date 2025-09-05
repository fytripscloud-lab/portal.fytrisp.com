import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Room } from './rooms.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableElement, TableExportUtil } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MasterService } from '@core/service/master.service';
import Swal from 'sweetalert2';
import { AlertService } from '@shared/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-rooms',
  templateUrl: './all-rooms.component.html',
  styleUrls: ['./all-rooms.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
    NgIf
  ],
})
export class AllroomComponent implements OnInit {
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
  roomList: any = [];
  selection = new SelectionModel<Room>(true, []);
  id?: number;
  room?: Room;
  isLoading: boolean = true;

  masterService = inject(MasterService);

  breadscrums = [
    {
      title: 'Stay Category',
      items: ['Home', 'Rooms'],
      active: 'Stay Category',
    },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alertService: AlertService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after last input
      distinctUntilChanged() // Only emit if value changed
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
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

  onSearch(searchTerm: string) {
    this.searchSubject.next(searchTerm);
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
    this.loadData();
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
      disableClose: true,
      data: {
        room: this.room,
        action: 'add',
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.refresh();
        // this.showNotification(
        //   'snackbar-success',
        //   'Stay Category added successfully!',
        //   'bottom',
        //   'center'
        // );
        this.toastr.success('Stay Category added successfully!');
      }
    });
  }
  editCall(row: Room) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      disableClose: true,
      data: {
        room: row,
        action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
        // this.showNotification(
        //   'black',
        //   'Stay Category updated successfully.',
        //   'bottom',
        //   'center'
        // );
        this.toastr.success('Stay Category updated successfully.');
      }
    });
  }
  deleteItem(row: Room) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
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
      action: () => this.masterService.changeRoomStatus(item_id, status).toPromise(),
      successMessage: 'Stay Category status updated successfully.'
    }).then(() => {
      this.refresh();
    }).catch((error) => {
      // Error already handled by the service
      console.debug('Operation failed or was cancelled:', error);
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  // public loadData() {
  //   this.masterService.getRoomLists({}).subscribe((resp:any)=>{
  //     this.roomList = resp.data;
  //     this.isLoading = false;
  //   })

  //   fromEvent(this.filter.nativeElement, 'keyup')
  //     // .debounceTime(150)
  //     // .distinctUntilChanged()
  //     .subscribe(() => {
  //       if (!this.roomList) {
  //         return;
  //       }
  //       this.roomList.filter = this.filter.nativeElement.value;
  //     });
  // }

  loadData(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.getRoomLists({page, page_size:pageSize, search, sort_by:this.sortColumn, sort_order:this.sortDirection}).subscribe({
      next: (res: any) => {
        this.roomList = res.data;   
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
          'Error loading room data',
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

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.roomList.map((x:any) => ({
        'Room Name': x.name,
        'Description': x.description,
        'Status': (x.is_active?'Active':'Inactive'),
        'Created At': x.created_at
      }));

    TableExportUtil.exportToExcel(exportData, 'RoomList');
  }
}
