import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { SendPaymentDialogComponent } from '../send-payment-dialog/send-payment-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { SendDuePaymentDialogComponent } from '../send-due-payment-dialog/send-due-payment-dialog.component';
import { PaymentLogDialogComponent } from '../payment-log-dialog/payment-log-dialog.component';

@Component({
    selector: 'app-send-payment-list-dialog',
    templateUrl: './send-payment-list-dialog.component.html',
    styleUrls: ['./send-payment-list-dialog.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,        
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        MatCheckboxModule,        
        NgxMatSelectSearchModule,
        MatProgressSpinnerModule,
        DatePipe,
        MatMenuModule
    ],
})
export class SendPaymentListDialogComponent {  
  dialogTitle: string;
  quotation: any;
  isLoading: boolean = false;
  bookingId: string = '';
  paymentList: any = [];
  filteredServiceProvider$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchCtrl = new FormControl('');
  
  private _onDestroy = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<SendPaymentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    // Set the defaults
    this.quotation = data.quotation;    
    this.bookingId = data.quotation?.id;
    this.dialogTitle = 'Service Provider Payment List';
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.masterService.getServiceProviderPaymentList(this.bookingId).subscribe({
      next: (res: any) => {
        this.paymentList = res?.data;
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

  getRowNumber(index: number): number {
    return index+1;
  }

  refresh() {
    this.loadData();
  }

  serviceProviderPayment(quotation:any)
  {
    const dialogRef = this.dialog.open(SendPaymentDialogComponent, {
      width: '80%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      data: {
        quotation:quotation,          
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.message) {
        this.refresh();
        this.toastr.success(result?.message);
      }
    });
  }

  editServiceProviderPayment(item:any)
  {
    const dialogRef = this.dialog.open(SendPaymentDialogComponent, {
      width: '80%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      data: {
        quotation:this.quotation,
        row: item
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.message) {
        this.refresh();
        this.toastr.success(result?.message);
      }
    });
  }

  payDuePayment(quotation:any)
  {
    const dialogRef = this.dialog.open(SendDuePaymentDialogComponent, {
      width: '80%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      data: {
        quotation:quotation,          
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.message) {
        this.refresh();
        this.toastr.success(result?.message);
      }
    });
  }

  paymentLogs(payment_history:any)
  {
    const dialogRef = this.dialog.open(PaymentLogDialogComponent, {
      width: '80%',
      maxWidth: '1100px',
      maxHeight: '90vh',
      data: {
        payment_history:payment_history,          
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.message) {
        this.refresh();
        this.toastr.success(result?.message);
      }
    });
  }
}
