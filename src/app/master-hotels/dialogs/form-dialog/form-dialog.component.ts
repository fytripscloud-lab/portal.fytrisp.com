import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MasterHotels } from '../../master-hotels.model';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgIf } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '@shared/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DialogData {
  id: number;
  action: string;
  hotelList: MasterHotels;
  route: any;
  destinations: any;
  destinationId: string;
  routeId: string;
  rooms: any;
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
        MatProgressSpinnerModule,
        NgIf,
        MatTooltipModule
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  masterHotelForm: UntypedFormGroup;
  hotelList: MasterHotels;
  routeList: any;
  destinations: any;
  destinationId: any;
  routeId: any;
  rooms: any;
  imagePreviews: any = [];
  selectedFiles: File[] = [];
  isUploading = false;
  searchCtrl = new FormControl('');
  filteredRouteList$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  destinationSearchCtrl = new FormControl('');
  filteredDestination$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    // Set the defaults    
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Hotel';
      this.hotelList = data.hotelList;
      this.routeList = data.route;
      this.destinations = data.destinations;
      this.rooms = data.rooms;
      this.destinationId = this.hotelList.destination.id;
      this.routeId = this.hotelList.route.id;
      data.hotelList.hotel_images.map((image: any) => {
        this.imagePreviews.push({img:image.file_path+'?w=130&h=130', id:image.id, alt_text:image.image_alt});
      });
    } else {
      this.dialogTitle = 'New Hotel';
      const blankObject = {} as MasterHotels;
      this.hotelList = new MasterHotels(blankObject);
      this.routeList = data.route;
      this.destinations = data.destinations;
      this.rooms = data.rooms;
      this.destinationId = data?.destinationId;
      this.routeId = data?.routeId;
    }
    this.masterHotelForm = this.createmasterHotelForm();
    this.filteredDestination$.next(this.destinations);
    if(this.destinationId){
      this.getRouteByDestination(this.destinationId);
    }
    

    this.destinationSearchCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(search => {
      if (!search) {
        this.filteredDestination$.next(this.destinations.slice());
        return;
      }
      
      // Filter the destinations
      const destinationSearchCtrl = search.toLowerCase();
      const search_filtered = this.destinations.filter((destinations: { name: string; }) => 
        destinations.name.toLowerCase().includes(destinationSearchCtrl)
      );
      this.filteredDestination$.next(search_filtered);
    });
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

  onDestinationChange(event: MatSelectChange) {    
      this.getRouteByDestination(event.value);
  }

  getRouteByDestination(destinationId:string)
  {
    this.masterService.getRouteByDestination(destinationId).subscribe({
      next: (res: any) => {
        this.routeList = res.data;
        this.filteredRouteList$.next(this.routeList);
        this.searchCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(search => {
            if (!search) {
              this.filteredRouteList$.next(this.routeList.slice());
              return;
            }
            
            // Filter the destinations
            const searchStr = search.toLowerCase();
            const filtered = this.routeList.filter((route: { route_name: string; }) => 
              route.route_name.toLowerCase().includes(searchStr)
            );
            this.filteredRouteList$.next(filtered);
          });
      }
    });
  }

  createmasterHotelForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.hotelList.id],
      destination_id: [this.destinationId, [Validators.required]],
      hotel_name: [this.hotelList.hotel_name, [Validators.required]],
      route_id: [this.routeId, [Validators.required]],
      room_id: [this.hotelList.room?.id, [Validators.required]]
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
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
          this.imagePreviews.push({
            img: e.target.result,
            id:''
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: any) {
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
        if(index.id){
          this.masterService.deleteHotelImage(index.id).subscribe((resp:any)=>{
            
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
          this.masterService.updateHotelImageAlt({'image_id':preview.id, 'image_alt':result.value}).subscribe((resp)=>{
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
    this.isUploading = true;
    this.masterService.addMasterHotel(this.masterHotelForm.getRawValue(), this.selectedFiles).subscribe((resp:any)=>{
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
    }
  );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
