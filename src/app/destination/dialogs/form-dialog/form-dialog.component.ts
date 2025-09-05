import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Destination } from '../../destination.model';
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

export interface DialogData {
  id: number;
  action: string;
  destination: Destination;
  countries: any;
}

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
  destinationForm: UntypedFormGroup;
  destination: Destination;
  isLoading: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;
  countryList:any = [];
  stateList: any = [];
  imagePreview: string ='';

  searchCountry = new FormControl('');
  filteredCountry$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchState = new FormControl('');
  filteredState$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
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
      this.dialogTitle = 'Edit Destination';
      this.destination = data.destination;
      this.imagePreview = data.destination?.file_path+'?w=130&h=130';
    } else {
      this.dialogTitle = 'Add Destination';
      const blankObject = {} as Destination;
      this.destination = new Destination(blankObject);
    }
    this.destinationForm = this.createDestinationForm();
    this.filteredCountry$.next(this.countryList);
      this.searchCountry.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(search => {
        if (!search) {
          this.filteredCountry$.next(this.countryList.slice());
          return;
        }
        
        // Filter the destinations
        const searchCountry = search.toLowerCase();
        const filtered = this.countryList.filter((country: { name: string; }) => 
          country.name.toLowerCase().includes(searchCountry)
        );
        this.filteredCountry$.next(filtered);
      });
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.searchInput.nativeElement,
      {
        //types: ['address'],
        //componentRestrictions: { country: 'US' } // Optional
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.handleAddressChange();
      });
    });
  }

  handleAddressChange() {
    const place = this.autocomplete.getPlace();
    
    if (place) {
      this.destinationForm.patchValue({
        search_location: place.formatted_address,
        latitude: place.geometry?.location.lat(),
        longitude: place.geometry?.location.lng()
      });

      if (place.address_components) {
        const addressComponents = place.address_components;
        const streetNumber = this.getAddressComponent(addressComponents, 'street_number');
        const route = this.getAddressComponent(addressComponents, 'route');
        const city = this.getAddressComponent(addressComponents, 'locality');
        const state_name = this.getAddressComponent(addressComponents, 'administrative_area_level_1');
        const country_name = this.getAddressComponent(addressComponents, 'country');
        const postalCode = this.getAddressComponent(addressComponents, 'postal_code');
        const selectCountry = this.countryList.filter((country: any) => country.name == country_name); 
        let selectState=[];
        if(selectCountry[0]?.id){
          this.getStateByCountry(selectCountry[0]?.id);
          
        }
        this.destinationForm.patchValue({
          house_no: streetNumber,
          locality: route,
          city: city,
          //state_id: selectState[0]?.id??'',
          country_id: selectCountry[0]?.id??'',
          pincode: postalCode,
          state: state_name,
          country: country_name
        });

        setTimeout(() => {
          console.log(this.stateList);
          selectState = this.stateList.filter((state: any) => state.name == state_name);          
          this.destinationForm.patchValue({
            state_id: selectState[0]?.id??'',
          });
        }, 1000);
      }
    }
  }

  private getAddressComponent(components: any[], type: string): string {
    const component = components.find(
      (component: any) => component.types.includes(type)
    );
    return component ? component.long_name : '';
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
  createDestinationForm(): UntypedFormGroup {
    if(this.destination?.country_data?.id){
      this.getStateByCountry(this.destination?.country_data?.id);
    }
    return this.fb.group({
      id: [this.destination?.id],
      name: [this.destination?.name, [Validators.required]],
      search_location: [this.destination?.search_location, [Validators.required]],
      latitude: [this.destination?.latitude, [Validators.required]],
      longitude: [this.destination?.longitude, [Validators.required]],
      house_no: [this.destination?.house_no],
      locality: [this.destination?.locality],
      pincode: [this.destination?.pincode],
      state_id: [this.destination?.state_data?.id],
      state: [this.destination?.state],
      city: [this.destination?.city],
      country_id: [this.destination?.country_data?.id],
      country: [this.destination?.country],
      meta_title: [this.destination?.meta_title, [Validators.required]],
      meta_description: [this.destination?.meta_description],
      meta_keywords: [this.destination?.meta_keywords],
      meta_tags: [this.destination?.meta_tags],
      image:[''],
      image_alt: [this.destination?.image_alt],
      is_next_destination: [this.destination?.is_next_destination],
      is_popular_destination: [this.destination?.is_popular_destination],
      is_dream_destination: [this.destination?.is_dream_destination],
      is_explore_destination: [this.destination?.is_explore_destination]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const result = this.validationService.validateImageFile(file);
      if (!result.isValid) {
        this.toastr.error(result.message);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview=e.target.result;
      };
      reader.readAsDataURL(file);
      this.destinationForm.patchValue({
        image: file
      });
    }
  }
  
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.isLoading=true;
    this.masterService.addDestination(this.destinationForm.getRawValue()).subscribe((resp:any)=>{
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

  onCountryChange(event: MatSelectChange) {    
      this.getStateByCountry(event.value);
  }

  getStateByCountry(countryId:any)
  {
    this.masterService.getStatesByCountry(countryId).subscribe((resp:any)=>{
      this.stateList = resp.data;
      this.filteredState$.next(this.stateList);
        this.searchState.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(search => {
          if (!search) {
            this.filteredState$.next(this.stateList.slice());
            return;
          }
          
          // Filter the destinations
          const searchState = search.toLowerCase();
          const filtered = this.stateList.filter((state: { name: string; }) => 
            state.name.toLowerCase().includes(searchState)
          );
          this.filteredState$.next(filtered);
        });
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
