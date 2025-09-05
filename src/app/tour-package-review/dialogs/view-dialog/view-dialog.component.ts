import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent],
  templateUrl: './view-dialog.component.html',
  styleUrl: './view-dialog.component.scss'
})
export class ViewDialogComponent {

  dialogTitle: string;
  review: any;
  constructor(
    public dialogRef: MatDialogRef<ViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.dialogTitle = 'Review Details';
    this.review = data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
