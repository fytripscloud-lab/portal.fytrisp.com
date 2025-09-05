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
import { ViewDialogComponent } from './dialogs/view-dialog/view-dialog.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { SendQuotationDialogComponent } from './dialogs/send-quotation-dialog/send-quotation-dialog.component';
import { CreateQuotationDialogComponent } from './dialogs/create-quotation-dialog/create-quotation-dialog.component';
import { FormsModule } from '@angular/forms';
import { StatusLogDialogComponent } from './dialogs/status-log-dialog/status-log-dialog.component';

@Component({
  selector: 'app-request-quotation',
  standalone: true,
  imports: [BreadcrumbComponent, DatePipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatPaginatorModule, NgIf, MatTooltipModule, MatMenuModule, FormsModule],
  templateUrl: './request-quotation.component.html',
  styleUrl: './request-quotation.component.scss'
})
export class RequestQuotationComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sortColumn: string = 'created_at';
  sortDirection: string = 'desc';
  currentPage = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  totalItems = 0;
  pageRow = 0;
  selectParams: any = {
    from_date: '',
    to_date: '',
    period: ''
  }

  private searchSubject = new Subject<string>();
  breadscrums = [
    {
      title: 'Quotation',
      items: ['Home'],
      active: 'Quotation',
    },
  ];
  fileUrl: string = environment.fileUrl;
  placeholderImage: string = environment.placeholder_image;
  isLoading: boolean = false;
  quotationLists: any = [];
  destinationList: any = [];
  destinationId: any;
  masterService = inject(MasterService);

  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadQuotationData();
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
      this.loadQuotationData(); // Reset to full list if search is empty
      return;
    }

    this.isLoading = true;
    // Assuming your API accepts a search parameter
    this.loadQuotationData(1, this.pageSize, searchTerm)
  }

  loadQuotationData(page: number = 1, pageSize: number = 10, search='') {
    this.isLoading = true;
    this.masterService.getQuotationList({page, page_size:pageSize, search, sort_by:this.sortColumn, destination:this.destinationId, sort_order:this.sortDirection, ...this.selectParams}).subscribe({
      next: (res: any) => {
        this.quotationLists = res.data;
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
        this.toastr.error('Error Loading Quotation');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadDestinations() {
    this.masterService.getAllDestinationList().subscribe({
      next: (res: any) => {
        this.destinationList = res.data;
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
    this.loadQuotationData(pageIndex, pageSize);
  }

  getRowNumber(index: number): number {
    return this.pageRow+index+1;
  }

  refresh() {
    this.loadQuotationData();
  }

  searchData()
  {
    this.loadQuotationData();
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

  editQuotation(row: any) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        width: '80%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          quotation: row,
          action: 'edit',
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
          this.toastr.success('Quotation updated successfully.');
        }
      });
  }

  sendQuotation(row: any) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '80%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        quotation: row,
        action: 'add',
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
        this.toastr.success('Quotation send successfully.');
      }
    });
}

createQuotation()
{
  const dialogRef = this.dialog.open(CreateQuotationDialogComponent, {
    width: '80%',
    maxWidth: '1100px',
    maxHeight: '90vh',
    disableClose: true,
    data: {      
      quotation: null,
      destinations: this.destinationList,
      action: 'create',
    }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result?.quotation_id) {
        //this.getQuotationDetails(result?.quotation_id);
        this.refresh();
        this.toastr.success('Quotation created successfully.');
      }
  });
}

modifyPackage(row: any){
  const dialogRef = this.dialog.open(CreateQuotationDialogComponent, {
    width: '80%',
    maxWidth: '1100px',
    maxHeight: '90vh',
    disableClose: true,
    data: {      
      quotation: row,
      destinations: this.destinationList,
      action: 'edit',
    }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      this.refresh();
      this.toastr.success('Quotation updated successfully.');
    }
  });
}

cancelQuotation(row: any) {
  Swal.fire({
    title: "Write the reason for cancellation.",
    input: "textarea",
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: 'Close',
    confirmButtonColor: '#005cbb',
    cancelButtonColor: '#ba1a1a',
    showLoaderOnConfirm: true,
    preConfirm: (text) => {
      if (!text) {
        Swal.showValidationMessage('Please enter cancellation reason');
        return false;
      }
      return this.masterService.cancelQuotation({
        quotation_id: row.id, 
        canceled_reason: text
      }).toPromise()
        .then((response) => {
          return response;
        })
        .catch((error) => {
          Swal.hideLoading();
          Swal.showValidationMessage(
            error.error?.detail || 'Something went wrong!'
          );
          return false; // This will prevent the modal from closing
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      this.refresh();
      this.toastr.success('Quotation cancelled successfully.');
    }
  });
}

callBackQuotation(row: any)
{
  const dialogRef = this.dialog.open(FormDialogComponent, {
    width: '40%',
    maxWidth: '1100px',
    maxHeight: '90vh',
    disableClose: true,
    data: {
      quotation: row,
      action: 'callback',
    }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      this.refresh();
      this.toastr.success('Quotation callback successfully.');
    }
  });
}

onDestinationChange(event: any) {
  this.destinationId = event.target.value;
  this.loadQuotationData();  
}

  handleImageError(event: any) {
    event.target.src = this.placeholderImage+'?im=Resize=(90,60)';
  }

  sendQuotationPayment(quotation:any)
  {
    const dialogRef = this.dialog.open(SendQuotationDialogComponent, {
        width: '40%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        disableClose: true,
        data: {
          quotation:quotation,
          type: 'payment'
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
          this.toastr.success('Payment link send successfully.');
        }
      });
  }

  getQuotationDetails(quotation_id:any)
  {
    const quotation = this.masterService.getQuotationDetails(quotation_id).subscribe({
      next: (res: any) => {
        if(res.data){
          this.cashPayment(res.data);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.detail);
      }
    });
  }

  cashPayment(quotation:any)
  {
    const dialogRef = this.dialog.open(SendQuotationDialogComponent, {
      width: '40%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        quotation:quotation,
        type: 'cash'
      }
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.refresh();
        this.toastr.success('Manual Payment successfully.');
      }
    });
  }

  statusLogReport(quotation:any)
  {
    const dialogRef = this.dialog.open(StatusLogDialogComponent, {
      width: '60%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      disableClose: true,
      data: {
        quotation:quotation,
        type: 'status_log'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        
      }
    });
  }

}
