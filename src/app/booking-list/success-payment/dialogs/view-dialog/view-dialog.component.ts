import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, DatePipe, CurrencyPipe, NgClass],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss'
})
export class ViewDialogComponent {

  dialogTitle: string;
  booking: any;
  constructor(
    public dialogRef: MatDialogRef<ViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitle = 'Booking Details';
    this.booking = data;
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
}
