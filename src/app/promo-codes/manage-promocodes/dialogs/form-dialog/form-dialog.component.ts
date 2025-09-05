import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
        MatCheckboxModule,
        AsyncPipe,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        NgIf,
        MatDatepickerModule
    ],
})
export class FormDialogComponent implements OnInit, OnDestroy {
  action: string;
  dialogTitle: string;
  promoForm: UntypedFormGroup;  
  isLoading: boolean = false;
  editData: any;
  promocodeTypes: any=[];
  youtubers: any = [];
  destinations: any;
  minDate: Date = new Date();
  searchCtrl = new FormControl('');
  private _onDestroy = new Subject<void>();
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private ngZone: NgZone,
    private validationService: ValidationService,
    private toastr: ToastrService,
    public datePipe: DatePipe
  ) {
    // Set the defaults
    this.action = data.action;
    this.destinations = data.destinations;
    this.editData = data?.row;   
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Youtuber';
    } else {
      this.dialogTitle = 'Add Youtuber';
    }
    this.promoForm = this.createpromoForm();
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
    this.getPromocodeTypes();
    this.getYoutuberListAll();
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

  createpromoForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.editData?.encrypt_id],
      code: [this.editData?.code, [Validators.required, Validators.maxLength(250)]],
      title: [this.editData?.title, [Validators.required, Validators.maxLength(250)]],
      description: [this.editData?.description, [Validators.required]],
      promo_code_type_id: [this.editData?.promo_code_type?.encrypt_id,[Validators.required]],
      youtuber_id: [this.editData?.youtuber?.encrypt_id||''],
      referrer_user_id: [this.editData?.referrer_user_id||''],
      destination_id: [this.editData?.destination?.id || null],
      discount_type: [this.editData?.discount_type, [Validators.required]],
      discount_value: [this.editData?.discount_value, [Validators.required]],
      max_discount_value: [this.editData?.max_discount_value||0],
      minimum_order_value: [this.editData?.minimum_order_value||0],      
      usage_per_user: [this.editData?.usage_per_user, [Validators.required]],
      usage_limit: [this.editData?.usage_limit, [Validators.required]],
      is_first_time_user: [this.editData?.is_first_time_user||false, [Validators.required]],
      valid_from: [this.editData?.valid_from, [Validators.required]],
      valid_until: [this.editData?.valid_until, [Validators.required]],
      is_active: [this.editData?.is_active || true],      
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.isLoading=true;
    this.promoForm.value.valid_from = this.datePipe.transform(this.promoForm.value.valid_from, 'yyyy-MM-dd');
    this.promoForm.value.valid_until = this.datePipe.transform(this.promoForm.value.valid_until, 'yyyy-MM-dd');
    this.masterService.managePromocodeList(this.promoForm.value).subscribe((resp:any)=>{
      if(resp.message){
        this.isLoading=false;
        this.dialogRef.close(1);
      }
    },
    (error: any) => {
      this.isLoading = false;
      this.toastr.error(error.error.detail);
    });
  }

  getPromocodeTypes()
  {
    this.masterService.getPromocodeTypes().subscribe((resp:any)=>{
      if(resp.data){
        this.promocodeTypes=resp.data;
      }
    },
    (error: any) => {
      this.isLoading = false;
      this.toastr.error(error.error.detail);
    });
  }

  getYoutuberListAll()
  {
    this.masterService.getYoutuberListAll().subscribe((resp:any)=>{
      if(resp.data){
        this.youtubers=resp.data;
      }
    },
    (error: any) => {
      this.isLoading = false;
      this.toastr.error(error.error.detail);
    });
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
