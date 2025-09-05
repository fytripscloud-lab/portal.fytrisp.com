import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
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
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-send-quotation-dialog',
    templateUrl: './send-quotation-dialog.component.html',
    styleUrls: ['./send-quotation-dialog.component.scss'],
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
        MatCheckboxModule,
        MatRadioModule,
        CurrencyPipe,
        MatCardModule,
        MatDatepickerModule,
        NgIf
    ],
})
export class SendQuotationDialogComponent {  
  dialogTitle: string = 'Send Payment Link';
  quotationForm: UntypedFormGroup;
  quotation: any;
  isLoading: boolean = false;
  payabelAmt: number = 0;
  minPayAmt: number = 0;
  dialogType: string = 'payment';  
  uploadedReceipt: string = 'Upload Receipt';
  totalPrice: any = 0;

  constructor(
    public dialogRef: MatDialogRef<SendQuotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private toastr: ToastrService,
    public datePipe: DatePipe
  ) {
    this.quotation = data.quotation;
    console.log(this.quotation);
    this.dialogType = data.type;    
    this.quotationForm = this.createQuotationForm();
    this.minPayAmt = (data.quotation?.quotation_price*30/100);
    this.totalPrice = data.quotation?.quotation_price;
    if(data.type=='cash'){
      this.dialogTitle = 'Manual Payment';
      this.totalPrice = data.quotation?.payment_remaining;
      this.minPayAmt = (data.quotation?.payment_remaining*30/100);
    }
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
  createQuotationForm(): UntypedFormGroup {
    return this.fb.group({      
      quotation_id: [this.quotation?.id, [Validators.required]],
      payable_amount: [''],
      pay_choice: ['1'],
      payment_method: ['cash', [Validators.required]],
      payment_date: ['', [Validators.required]],
      money_receipt:['']
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //const result = this.validationService.validateImageFile(file);
      // const customResult = this.validationService.validateFile(file, {
      //   maxSizeInMB: 5,
      //   allowedTypes: ['image/', 'application/pdf']
      // });
      // if (!customResult.isValid) {
      //   this.toastr.error(customResult.message);
      //   return;
      // }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        //this.imagePreview=e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadedReceipt = file.name;
      this.quotationForm.patchValue({
        money_receipt: file
      });
    }
  }
  
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmUpdate(): void {
     if(this.quotationForm.invalid){
      return;
    }
    if(this.payabelAmt==0){
      this.payabelAmt = this.quotation?.payment_remaining;
    }
    if(this.quotationForm.value.money_receipt=='' && this.quotationForm.value.payment_method == 'upi'){
      this.toastr.error('Please upload money receipt');
      return;
    }
    this.isLoading=true;
    if (this.dialogType == 'cash') {
      let formData = new FormData();
      formData.append('quotation_id', this.quotation?.id);
      formData.append('amount', this.payabelAmt.toString());
      formData.append('payment_method', this.quotationForm.value.payment_method);
      if(this.quotationForm.value.money_receipt){
        formData.append('money_receipt', this.quotationForm.value.money_receipt);
      }
      let paymentDate = this.quotationForm.value.payment_date;
      if (paymentDate) {
        paymentDate = this.datePipe.transform(paymentDate, 'yyyy-MM-dd');
      }
      formData.append('payment_date', paymentDate || '');
      this.masterService.cashPayment(formData).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          this.dialogRef.close(1);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err.error.detail);
        }
      });
      return;
    }
    if (this.dialogType == 'payment') {
    this.masterService.sendQuotationPayment({quotation_id: this.quotation?.id, amount: this.payabelAmt}).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.dialogRef.close(1);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.error.detail);
      }
    });
  }
    
  }

  updatePayAmount(e:any)
  {   
    let min_price = this.quotation?.payment_remaining; 
    if(e.value!=1){
      min_price = (this.quotation?.payment_remaining*30/100);
    }
    min_price = Math.round(min_price);
    this.payabelAmt=min_price;
    if(e.value==3){
      this.payabelAmt=1;
    }
    this.quotationForm.patchValue({
      payable_amount: min_price
    })
  }
}
