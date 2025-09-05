import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MasterService } from '@core/service/master.service';

@Component({
  selector: 'app-status-log-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, DatePipe],
  templateUrl: './status-log-dialog.component.html',
  styleUrl: './status-log-dialog.component.scss'
})
export class StatusLogDialogComponent {

  dialogTitle: string;
  quotation: any;
  leadStatusLogs: any = [];
  constructor(
    public dialogRef: MatDialogRef<StatusLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public masterSevice: MasterService
  ) {
    this.dialogTitle = 'Status Log';
    this.quotation = data;
    this.masterSevice.queryLeadStatus(data?.quotation?.id).subscribe((res: any) => {
      this.leadStatusLogs = res.data;
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
