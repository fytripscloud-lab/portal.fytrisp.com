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
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { ValidationService } from '@shared/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CountryCodeService } from '@core/service/country-code.service';
declare const google: any;

@Component({
    selector: 'app-form-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss'],
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
        MatCardModule,
        CommonModule,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class PaymentDialogComponent implements OnInit, OnDestroy {
  action: string;
  dialogTitle: string;
  serviceProviderForm: UntypedFormGroup;  
  destinations: any;
  imagePreviews: any = [];
  selectedFiles: File[] = [];
  routeList: any = [];
  serviceType: any = [];
  bankAttachment: string = '';
  destinationId: any;
  searchCtrl = new FormControl('');
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;
  public countryCodeService = inject(CountryCodeService);
  public flag = 'https://flagcdn.com/w320/in.png';
  public filtered:any = [];

  private _onDestroy = new Subject<void>();
  isUploading = false;
  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private validationService: ValidationService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Servive Provider';
      this.routeList = data.routeList;
      this.destinations = data.destinations;
      this.destinationId = this.routeList.destination.id;
      this.serviceType = data.serviceType;
      // data.routeList.images.map((image: any) => {
      //   this.imagePreviews.push({img:image.file_path+'?w=130&h=130', id:image.id, alt_text:image.image_alt});
      // });
    } else {
      this.dialogTitle = 'Add Servive Provider';
      this.destinations = data.destinations;
      this.destinationId = data?.destinationId;
      this.serviceType = data.serviceType;
    }
    this.filtered = this.countryCodeService?.codes;
    this.serviceProviderForm = this.createserviceProviderForm();
    this.bankAttachment = this.routeList?.bank_attachment;
    this.filteredDestinations$.next(this.destinations);
    this.searchCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(search => {
      if (!search) {
        this.filteredDestinations$.next(this.destinations.slice());
        return;
      }
      
      // Filter the destinations
      const searchStr = search.toLowerCase();
      const filtered = this.destinations.filter((destination: { name: string; }) => 
        destination.name.toLowerCase().includes(searchStr)
      );
      this.filteredDestinations$.next(filtered);
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
  createserviceProviderForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.routeList?.id],      
      destination_id: [this.destinationId, [Validators.required]],
      service_provider_type_id: [this.routeList?.service_provider_type?.id, [Validators.required]],
      provider_name: [this.routeList?.provider_name, [Validators.required]],
      provider_email: [this.routeList?.provider_email, [Validators.email]],
      country_code: [this.routeList?.country_code, [Validators.required]],
      provider_contact: [this.routeList?.provider_contact, [Validators.required]],
      alternate_country_code: [this.routeList?.alternate_country_code],
      provider_alternate_contact: [this.routeList?.provider_alternate_contact],
      bank_account_number: [this.routeList?.bank_account_number],
      bank_ifsc_code: [this.routeList?.bank_ifsc_code],
      bank_account_holder_name: [this.routeList?.bank_account_holder_name],
      upi_id: [this.routeList?.upi_id],
      bank_attachment: [''],
      description: [this.routeList?.description],
      filter: ['']
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    // const result = this.validationService.validateMultipleImageFiles(files);
    // console.log(result);
    // if (!result.isValid) {
    //   this.toastr.error(result.message);
    //   return;
    // }
    if (files) {
      for (let file of files) {
        // const result = this.validationService.validateImageFile(file);
        // if (!result.isValid) {
        //   this.toastr.error(result.message);
        //   return;
        // }
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push({img:e.target.result, id:'', alt_text:''});
        };
        reader.readAsDataURL(file);
        this.serviceProviderForm.patchValue({
          bank_attachment: file
        });
      }
    }
  }

  removeImage(preview:any, index: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.imagePreviews.splice(index, 1);
        this.selectedFiles.splice(index, 1);
        if(preview.id){
          this.masterService.deleteRouteImage(preview.id).subscribe((resp:any)=>{
            
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });
    
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {    
    this.isUploading = true;
    this.masterService.manageServiceProvider(this.serviceProviderForm.getRawValue()).subscribe((resp:any)=>{
      if(resp.message){
        this.dialogRef.close(1);
      }
    },
    (error: any) => {
      this.isUploading = false;
      this.toastr.error(error.error.detail);
    });
  }

  filter(evt:any) {
    this.filtered = this.countryCodeService?.codes.filter(option => 
      option.country.toLowerCase().includes(this.serviceProviderForm.value.filter.toLowerCase()) ||
      option.code.toLowerCase().includes(this.serviceProviderForm.value.filter.toLowerCase())
    );
  }

  clearFilter() {    
    this.serviceProviderForm.get('filter')?.setValue('');
    this.filtered = this.countryCodeService?.codes; // Reset to original list
  }

  ngOnDestroy() {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
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
