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
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
    selector: 'app-send-payment-dialog',
    templateUrl: './send-payment-dialog.component.html',
    styleUrls: ['./send-payment-dialog.component.scss'],
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
        AsyncPipe,
        NgxMatSelectSearchModule
    ],
})
export class SendPaymentDialogComponent {  
  dialogTitle: string;
  paymentForm: UntypedFormGroup;
  quotation: any;
  isLoading: boolean = false;
  servicePrviderType: any = [];
  serviceProviderList: any;
  rowData: any;
  filteredServiceProvider$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchCtrl = new FormControl('');
  
  private _onDestroy = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<SendPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.quotation = data.quotation;
    this.rowData = data?.row;
    this.getServiceType();
    this.dialogTitle = 'Service Provider Payment';
    if(this.rowData?.service_provider?.service_provider_type?.id){
      this.getServiceProviderList(this.rowData?.service_provider?.service_provider_type?.id);
    }
    
    this.paymentForm = this.createpaymentForm();
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
  createpaymentForm(): UntypedFormGroup {
    return this.fb.group({ 
      id: [this.rowData?.id ||''],     
      quotation_id: [this.quotation?.id, [Validators.required]],
      service_provider_id: [this.rowData?.service_provider?.id||'', [Validators.required]],
      deal_amount: [this.rowData?.deal_amount||'', [Validators.required]],
      paid_amount: [this.rowData?.paid_amount||'', [Validators.required]],
      comment: [this.rowData?.description||''],
      payment_mode: [this.rowData?.description||''],
      money_receipt: [''],
      provider_receipt: [''],
      service_type:[this.rowData?.service_provider?.service_provider_type?.id||''],
    });
  }

  getServiceType()
  {
    this.masterService.getBookingServiceProviderType({}).subscribe((resp:any)=>{
      this.servicePrviderType = resp.data;      
    })
  }

  getServiceProviderList(service_type:any)
  {    
    this.masterService.getServiceProviderList(this.quotation?.destination_data[0]?.id, service_type).subscribe((resp:any)=>{
      this.serviceProviderList = resp.data;
      this.filteredServiceProvider$.next(this.serviceProviderList);
      this.searchCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(search => {
        if (!search) {
          this.filteredServiceProvider$.next(this.serviceProviderList.slice());
          return;
        }
        
        // Filter the destinations
        const searchStr = search.toLowerCase();
        const filtered = this.serviceProviderList.filter((provider: { provider_name: string; }) => 
          provider.provider_name.toLowerCase().includes(searchStr)
        );
        this.filteredServiceProvider$.next(filtered);
      });
    });
  }

  onFileSelected(event: any) {
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
      this.paymentForm.patchValue({
        money_receipt: file
      });
    }
  }

  onFileSelectedProvider(event: any) {
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
      this.paymentForm.patchValue({
        provider_receipt: file
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
    this.isLoading=true;
    const formData = new FormData();
    (this.paymentForm.value?.id)?formData.append('id', this.paymentForm.value.id):'';
    formData.append('quotation_id', this.paymentForm.value.quotation_id);
    formData.append('service_provider_id', this.paymentForm.value.service_provider_id);
    formData.append('deal_amount', this.paymentForm.value.deal_amount);
    formData.append('paid_amount', this.paymentForm.value.paid_amount);
    (this.paymentForm.value.comment)?formData.append('comment', this.paymentForm.value.comment):'';
    (this.paymentForm.value.payment_mode)?formData.append('payment_mode', this.paymentForm.value.payment_mode):'';
    (this.paymentForm.value.money_receipt)?formData.append('money_receipt', this.paymentForm.value.money_receipt):'';
    (this.paymentForm.value.provider_receipt)?formData.append('provider_receipt', this.paymentForm.value.provider_receipt):'';

    this.masterService.serviceProviderPayment(formData).subscribe((resp:any)=>{
      if(resp.message){
        this.isLoading=false;
        this.dialogRef.close(resp);
      }
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
