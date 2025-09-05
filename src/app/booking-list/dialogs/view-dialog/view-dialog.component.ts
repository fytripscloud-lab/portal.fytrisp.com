import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-view-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, DatePipe, CurrencyPipe, NgClass, MatTabsModule],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss'
})
export class ViewDialogComponent {

  dialogTitle: string;
  booking: any;
  bookingType: string = 'success';
  constructor(
    public dialogRef: MatDialogRef<ViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitle = 'Booking Details';
    this.booking = data?.row;
    if(data?.type){
      this.bookingType = data?.type;
    }
    
    // Parse cancellation policy JSON if it exists
    if (this.booking?.cancellation_policy_json && typeof this.booking.cancellation_policy_json === 'string') {
      try {
        this.booking.cancellation_policy_json = JSON.parse(this.booking.cancellation_policy_json);
      } catch (e) {
        console.error('Error parsing cancellation policy JSON:', e);
        this.booking.cancellation_policy_json = [];
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getBookingStatus(list: any)
  {
    let bookStatus = 'Pending';
    if(list.is_active){
      bookStatus = 'Active';
    }
    else if(list.is_canceled){
      bookStatus = 'Cancelled';
    }
    else if(list.is_completed){
      bookStatus = 'Completed';
    }

    return bookStatus;
  }

  getPaymentStatus(payment_status:string){
    if(payment_status=='partial'){
      return 'bg-primary';
    }
    else if(payment_status=='paid'){
      return 'bg-success';
    }else if(payment_status=='failed'){
      return 'bg-danger';
    }else{
      return 'bg-warning';
    }
  }

  sendPayment(type:string){
    this.dialogRef.close({type, row:this.booking});
  }


}
