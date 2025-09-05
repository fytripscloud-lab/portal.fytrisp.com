import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, DatePipe],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss'
})
export class ViewDialogComponent {

  dialogTitle: string;
  rowData: any;
  constructor(
    public dialogRef: MatDialogRef<ViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitle = 'Service Provider Details';
    this.rowData = data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
