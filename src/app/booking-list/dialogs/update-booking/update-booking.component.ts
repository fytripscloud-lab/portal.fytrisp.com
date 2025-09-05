import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, inject, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CountryCodeService } from '@core/service/country-code.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-booking',
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
    NgxMatSelectSearchModule,
    MatRadioModule,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './update-booking.component.html',
  styleUrl: './update-booking.component.scss'
})
export class UpdateBookingComponent {
  dialogTitle: string = 'Update Booking';
  quotationForm: UntypedFormGroup;
  quotation: any;
  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<UpdateBookingComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private masterService: MasterService, private fb: UntypedFormBuilder,
    private toastr: ToastrService){
      this.quotation = data.quotation;
      this.quotationForm = this.createQuotationForm();
  }

  createQuotationForm(): UntypedFormGroup {    
    return this.fb.group({          
      quotation_id: [this.quotation?.id, [Validators.required]],
      package_price: [this.quotation?.main_price, [Validators.required]],
      booking_price:[this.quotation?.quotation_price, [Validators.required]],      
      no_of_rooms: [this.quotation?.no_of_rooms],      
      traveler_no_of_adult: [this.quotation?.traveler_no_of_adult],
      traveler_no_of_child: [this.quotation?.traveler_no_of_child],
      trip_package_price: [this.quotation?.main_price, [Validators.required]],
      trip_booking_price:[this.quotation?.quotation_price, [Validators.required]],      
      trip_no_of_rooms: [this.quotation?.no_of_rooms],      
      trip_traveler_no_of_adult: [this.quotation?.traveler_no_of_adult],
      trip_traveler_no_of_child: [this.quotation?.traveler_no_of_child],
    });
  }

  public confirmUpdate(): void {
    this.isLoading=true;
    if(this.quotationForm.invalid){
      this.isLoading=false;
      return;
    }    
    const formData = {
      quotation_id: this.quotationForm.value.quotation_id,
      package_price: this.quotationForm.value.package_price,
      booking_price: this.quotationForm.value.booking_price,
      no_of_rooms: this.quotationForm.value.no_of_rooms,
      traveler_count: (this.quotationForm.value.traveler_no_of_adult+this.quotationForm.value.traveler_no_of_child),
      traveler_no_of_adult: this.quotationForm.value.traveler_no_of_adult,
      traveler_no_of_child: this.quotationForm.value.traveler_no_of_child
    }
    this.masterService.updatePaymentBooking(formData).subscribe((resp)=>{
      this.isLoading=false;
      this.dialogRef.close(resp);
    }
    ,(err)=>{
      this.isLoading=false;
      this.toastr.error(err?.err?.detail || 'Unable to send quotation');
    })
    
  }

  onNoClick(): void {
    this.dialogRef.close();
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
