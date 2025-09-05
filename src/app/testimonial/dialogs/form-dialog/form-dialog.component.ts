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
import { AsyncPipe, NgIf } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
declare const google: any;

@Component({
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
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
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class FormDialogComponent implements OnInit, OnDestroy {
  action: string;
  dialogTitle: string;
  testimonialForm: UntypedFormGroup;
  isLoading: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;
  countryList:any = [];
  stateList: any = [];
  imagePreview: string ='';
  testimonial: any = {};
  searchCountry = new FormControl('');
  filteredCountry$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchState = new FormControl('');
  filteredState$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private ngZone: NgZone,
    private validationService: ValidationService,
    private toastr: ToastrService
  ) {
    // Set the defaults
    this.action = data.action;
    this.countryList = data.countries;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Testimonial';
      this.testimonial = data.testimonial;
      this.imagePreview = data.testimonial?.file_path;
    } else {
      this.dialogTitle = 'Add Testimonial';
      this.testimonial = {};
    }
    this.testimonialForm = this.createtestimonialForm();
    this.filteredCountry$.next(this.countryList);
      this.searchCountry.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(search => {
        if (!search) {
          this.filteredCountry$.next(this.countryList.slice());
          return;
        }
        
        // Filter the testimonials
        const searchCountry = search.toLowerCase();
        const filtered = this.countryList.filter((country: { name: string; }) => 
          country.name.toLowerCase().includes(searchCountry)
        );
        this.filteredCountry$.next(filtered);
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
  createtestimonialForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.testimonial?.encrypt_id],
      name: [this.testimonial?.name, [Validators.required]],
      email: [this.testimonial?.email, [Validators.required, Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i), Validators.maxLength(250)]],
      rating: [this.testimonial?.rating, [Validators.required]],
      message: [this.testimonial?.message, [Validators.required]],
      is_active: [0]
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.isLoading=true;
    this.masterService.addTestimonial(this.testimonialForm.getRawValue()).subscribe((resp:any)=>{
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

  ngOnDestroy() {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
