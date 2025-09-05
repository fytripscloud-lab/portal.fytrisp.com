import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, inject, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { ValidationService } from '@shared/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CountryCodeService } from '@core/service/country-code.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
declare const google: any;

@Component({
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        MatCardModule,
        CommonModule,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        NgIf,
        MatDatepickerModule
    ],
})
export class FormDialogComponent implements OnInit, OnDestroy {
  action: string;
  dialogTitle: string;
  officeExpenseForm: UntypedFormGroup;
  expenseCategory: any;
  expenseRow: any;
  searchCtrl = new FormControl('');
  filteredCategory$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  isSavng: boolean = false;

  private _onDestroy = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    public datePipe: DatePipe
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Expense';
      this.expenseCategory = data.expenseCategory;
      this.expenseRow = data.row;
    } else {
      this.dialogTitle = 'Add Expense';
      this.expenseCategory = data.expenseCategory;
    }
    this.officeExpenseForm = this.createofficeExpenseForm();
    this.filteredCategory$.next(this.expenseCategory);
    this.searchCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(search => {
      if (!search) {
        this.filteredCategory$.next(this.expenseCategory.slice());
        return;
      }
      
      // Filter the destinations
      const searchStr = search.toLowerCase();
      const filtered = this.expenseCategory.filter((expenseCategory: { category_name: string; }) => 
        expenseCategory.category_name.toLowerCase().includes(searchStr)
      );
      this.filteredCategory$.next(filtered);
    });
  }

  ngOnInit(): void {
    
  }

  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createofficeExpenseForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.expenseRow?.id],      
      category_id: [this.expenseRow?.category?.id, [Validators.required]],
      paid_to: [this.expenseRow?.paid_to, [Validators.required]],
      description: [this.expenseRow?.description, [Validators.required]],
      amount: [this.expenseRow?.amount, [Validators.required]],
      transaction_type: [this.expenseRow?.transaction_type, [Validators.required]],
      payment_mode: [this.expenseRow?.payment_mode, [Validators.required]],
      expense_date: [this.expenseRow?.expense_date, [Validators.required]],
      filter: ['']
    });
  }


  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void { 
    this.isSavng=true;
    this.officeExpenseForm.value.expense_date = this.datePipe.transform(this.officeExpenseForm.value.expense_date, 'yyyy-MM-dd');
    this.masterService.manageOfficeExpense(this.officeExpenseForm.value).subscribe((resp:any)=>{
      if(resp.message){
        this.dialogRef.close(1);
      }
    },
    (error: any) => {      
      this.isSavng=false; 
      this.toastr.error(error.error.detail);
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
