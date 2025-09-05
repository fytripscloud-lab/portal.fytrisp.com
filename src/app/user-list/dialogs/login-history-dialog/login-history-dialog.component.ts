import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';

@Component({
  selector: 'app-login-history-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, DatePipe, CurrencyPipe, NgClass],
  templateUrl: './login-history-dialog.component.html',
  styleUrl: './login-history-dialog.component.scss'
})
export class LoginHistoryDialogComponent {

  dialogTitle: string;
  loginHistory: any;
  user_id: any;

  constructor(
    public dialogRef: MatDialogRef<LoginHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService
  ) {
    this.dialogTitle = 'User Login History';
    this.user_id = data?.user_id;   
    if(data?.user_id){
      this.getUserLoginHistory(data?.user_id);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getUserLoginHistory(user_id:any)
  {
    this.masterService.getUserLoginHistory(user_id, {}).subscribe({
      next: (res: any) => {
        this.loginHistory = res.data;
      }
    });
  }

}
