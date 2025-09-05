import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';

@Component({
  selector: 'app-payment-log-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, DatePipe],
  templateUrl: './payment-log-dialog.component.html',
  styleUrl: './payment-log-dialog.component.scss'
})
export class PaymentLogDialogComponent {

  dialogTitle: string;
  quotation: any;
  paymentLogs: any = [];
  constructor(
    public dialogRef: MatDialogRef<PaymentLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public masterSevice: MasterService
  ) {
    this.dialogTitle = 'Payment History';
    this.paymentLogs = data?.payment_history;    
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
