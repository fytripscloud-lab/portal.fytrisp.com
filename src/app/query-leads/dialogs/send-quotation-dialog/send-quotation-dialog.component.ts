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
import { CurrencyPipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-send-quotation-dialog',
    templateUrl: './send-quotation-dialog.component.html',
    styleUrls: ['./send-quotation-dialog.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
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

  constructor(
    public dialogRef: MatDialogRef<SendQuotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder
  ) {
    this.quotation = data.quotation;
    this.dialogType = data.type;
    if(data.type=='cash'){
      this.dialogTitle = 'Manual Payment';
    }
    this.quotationForm = this.createQuotationForm();
    this.minPayAmt = (data.quotation?.offer_price*30/100);
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
      payable_amount: ['', [Validators.required]],
      pay_choice: ['1'],
    });
  }

  
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmUpdate(): void {
    this.isLoading=true;
    if(this.dialogType=='cash'){
      this.masterService.cashPayment({quotation_id: this.quotation?.id, amount:this.payabelAmt}).subscribe((resp:any)=>{
        this.isLoading=false;
          this.dialogRef.close(1);
      });
      return;
    }
    if(this.dialogType=='payment'){
      this.masterService.sendQuotationPayment({quotation_id: this.quotation?.id, amount:this.payabelAmt}).subscribe((resp:any)=>{
        this.isLoading=false;
          this.dialogRef.close(1);
      });
    }
    
  }

  updatePayAmount(e:any)
  {   
    let min_price = this.quotation?.offer_price; 
    if(e.value!=1){
      min_price = (this.quotation?.offer_price*30/100);
    }
    min_price = Math.round(min_price);
    this.payabelAmt=min_price;
    this.quotationForm.patchValue({
      payable_amount: min_price
    })
  }
}
