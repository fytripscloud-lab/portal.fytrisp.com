import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-change-action',
    templateUrl: './change-action.component.html',
    styleUrls: ['./change-action.component.scss'],
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
    ],
})
export class ChangeActionComponent {
  action: string;
  dialogTitle: string;
  quotationForm: UntypedFormGroup;
  quotation: any;
  isLoading: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ChangeActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Modify Quotation';
      this.quotation = data.quotation;
    } else {
      this.dialogTitle = 'Quotation';
      // const blankObject = {} as Destination;
      // this.destination = new Destination(blankObject);
    }
    this.quotationForm = this.createQuotationForm();
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
      offer_price: [this.quotation.offer_price, [Validators.required]],
      full_name: [this.quotation.full_name, [Validators.required]],
      mobile_no: [this.quotation.mobile_no, [Validators.required]],
      email: [this.quotation.email, [Validators.required, Validators.email]],
      travel_start_date: [this.quotation.travel_start_date, [Validators.required]],
      traveler_count: [this.quotation.traveler_count],
      traveler_no_of_adult: [this.quotation.traveler_no_of_adult],
      traveler_no_of_child: [this.quotation.traveler_no_of_child],
      traveler_no_of_infant: [this.quotation.traveler_no_of_infant]
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
    let formData = {
      offer_price: this.quotationForm.value.offer_price,
      full_name: this.quotationForm.value.full_name,
      mobile_no: this.quotationForm.value.mobile_no,
      travel_start_date: this.quotationForm.value.travel_start_date,
      traveler_count: (parseInt(this.quotationForm.value.traveler_no_of_adult)+parseInt(this.quotationForm.value.traveler_no_of_child)+parseInt(this.quotationForm.value.traveler_no_of_infant)),
      traveler_no_of_adult: this.quotationForm.value.traveler_no_of_adult,
      traveler_no_of_child: this.quotationForm.value.traveler_no_of_child,
      traveler_no_of_infant: this.quotationForm.value.traveler_no_of_infant
    }
    this.masterService.updateQuotation(formData, this.quotation.id).subscribe((resp:any)=>{
      if(resp.message){
        this.isLoading=false;
        this.dialogRef.close(1);
      }
    });
  }
}
