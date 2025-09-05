import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MasterRoute } from '../../master-route.model';
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
declare const google: any;
export interface DialogData {
  id: number;
  action: string;
  routeList: MasterRoute;
  destinations: any;
  destinationId: string;
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
        MatCardModule,
        CommonModule,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class FormDialogComponent implements OnInit, OnDestroy {
  action: string;
  dialogTitle: string;
  masterRouteForm: UntypedFormGroup;
  routeList: MasterRoute;
  destinations: any;
  imagePreviews: any = [];
  selectedFiles: File[] = [];
  destinationId: any;
  searchCtrl = new FormControl('');
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;

  private _onDestroy = new Subject<void>();
  isUploading = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private validationService: ValidationService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Route';
      this.routeList = data.routeList;
      this.destinations = data.destinations;
      this.destinationId = this.routeList.destination.id;
      data.routeList.images.map((image: any) => {
        this.imagePreviews.push({img:image.file_path+'?w=130&h=130', id:image.id, alt_text:image.image_alt});
      });
    } else {
      this.dialogTitle = 'Add Route';
      const blankObject = {} as MasterRoute;
      this.routeList = new MasterRoute(blankObject);
      this.destinations = data.destinations;
      this.destinationId = data?.destinationId;
    }
    this.masterRouteForm = this.createmasterRouteForm();
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
      this.masterRouteForm.patchValue({
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
        //const selectCountry = this.countryList.filter((country: any) => country.name == country_name); 
        let selectState=[];
        // if(selectCountry[0]?.id){
        //   this.getStateByCountry(selectCountry[0]?.id);
          
        // }
        this.masterRouteForm.patchValue({
          house_no: streetNumber,
          locality: route,
          city: city,
          pincode: postalCode,
          state: state_name,
          country: country_name
        });

        // setTimeout(() => {
        //   console.log(this.stateList);
        //   selectState = this.stateList.filter((state: any) => state.name == state_name);          
        //   this.destinationForm.patchValue({
        //     state_id: selectState[0]?.id??'',
        //   });
        // }, 1000);
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
  createmasterRouteForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.routeList?.id],
      route_name: [this.routeList?.route_name, [Validators.required]],
      destination_id: [this.destinationId, [Validators.required]],
      search_location: [this.routeList?.search_location, [Validators.required]],
      latitude: [this.routeList?.latitude, [Validators.required]],
      longitude: [this.routeList?.longitude, [Validators.required]],
      house_no: [this.routeList?.house_no],
      locality: [this.routeList?.locality],
      pincode: [this.routeList?.pincode],
      state: [this.routeList?.state],
      city: [this.routeList?.city],
      country: [this.routeList?.country]
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
        const result = this.validationService.validateImageFile(file);
        if (!result.isValid) {
          this.toastr.error(result.message);
          return;
        }
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push({img:e.target.result, id:'', alt_text:''});
        };
        reader.readAsDataURL(file);
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

  async addImageTag(preview: { id: number, img: string, alt_text:string }): Promise<void> {
    try {
      const result = await Swal.fire({
        input: "text",
        inputLabel: "Image Alt Tag",
        inputPlaceholder: "Enter image alt tag",
        showCancelButton: true,
        inputValue: preview?.alt_text || '',
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter an alt tag!';
          }
          return null;
        }
      });
  
      if (result.isConfirmed && result.value) {
        // Make API call to update the alt text
        this.masterService.updateRouteImageAlt({'image_id':preview.id, 'image_alt':result.value}).subscribe((resp)=>{
          const imageIndex = this.imagePreviews.findIndex((img:any) => img.id === preview.id);
          if (imageIndex !== -1) {
            this.imagePreviews[imageIndex] = {
              ...this.imagePreviews[imageIndex],
              alt_text: result.value
            };
          }
          // Show success message
          Swal.fire({
            title: 'Success',
            text: `Alt tag successfully updated to: ${result.value}`,
            icon: 'success'
          });
        });
      }
    } catch (error:any) {
      console.error('Error adding image tag:', error);
      await Swal.fire({
        title: 'Error',
        text: error?.error?.detail || 'Failed to update image alt tag',
        icon: 'error'
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
    if(this.selectedFiles.length==0 && this.action=='add'){
      this.toastr.error('Please select at least one image');
      return;
    }
    this.isUploading = true;
    this.masterService.addMasterRoute(this.masterRouteForm.getRawValue(), this.selectedFiles).subscribe((resp:any)=>{
      if(resp.message){
        this.imagePreviews = [];
        this.selectedFiles = [];
        this.isUploading = false;
        this.dialogRef.close(1);
      }
    },
    (error: any) => {
      this.isUploading = false;
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
