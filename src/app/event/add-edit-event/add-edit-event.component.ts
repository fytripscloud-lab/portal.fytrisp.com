import { Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { environment } from 'environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ValidationService } from '@shared/validation.service';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
declare const google: any;

@Component({
  selector: 'app-add-edit-event',
  standalone: true,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  imports: [BreadcrumbComponent, MatIconModule, MatButtonModule, MatProgressSpinnerModule, NgxEditorModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, CommonModule, RouterLink, FileUploadComponent, MatCardModule, MatTooltipModule, MatSelectModule, NgxMatSelectSearchModule, MatDatepickerModule, NgxMaterialTimepickerModule],
  templateUrl: './add-edit-event.component.html',
  styleUrl: './add-edit-event.component.scss'
})
export class AddEditEventComponent implements OnInit {

  breadscrums = [
    {
      title: 'Add Event',
      items: ['Home'],
      active: 'Add Event',
    },
  ];

  editor?: Editor;
  html = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  selectedFiles: File[] = [];

  eventForm: UntypedFormGroup;
  imagePreviews: any = [];
  blogId: string = '';
  blogData: any = {};
  isLoading: boolean = false;
  searchCtrl = new FormControl('');
  destinationList: any = [];
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  bannerImage: string = '';
  blogImage: string = '';
  uploadedImages: any = [];
  selectedEventImg: any[] = [];
  minDate: Date = new Date();
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;

  constructor(private _formBuilder: FormBuilder, private masterService: MasterService, private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private validationService: ValidationService, private clipboard: Clipboard, private ngZone: NgZone, private datePipe: DatePipe) {
      this.eventForm = this.createEventForm();
    }
  

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let blog_id = params.get('blog_id');
      if(blog_id!=null && blog_id!=undefined){
        this.breadscrums = [
        {
          title: 'Edit Event',
          items: ['Home'],
          active: 'Edit Event',
        },
      ];
        this.blogId = blog_id;
        this.getEventDetails(blog_id);
      }
    });
    this.editor = new Editor();    
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
      this.eventForm.patchValue({
        address: place.formatted_address,
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
        this.eventForm.patchValue({                    
          city: city,
          // pincode: postalCode,
          state: state_name,
          country: country_name
        });
      }
    }
  }

  private getAddressComponent(components: any[], type: string): string {
    const component = components.find(
      (component: any) => component.types.includes(type)
    );
    return component ? component.long_name : '';
  }

  getEventDetails(blogId:string)
  {
    this.uploadedImages=[];
    this.masterService.getEventDetails(blogId).subscribe((resp:any)=>{
      if(resp.data){
        this.blogData = resp.data;
        this.eventForm.patchValue({
          id: this.blogData.id,
          title: this.blogData.title,
          short_description: this.blogData.short_description,
          content: this.blogData.content,
          start_date: this.blogData.start_date,
          end_date: this.blogData.end_date,
          start_time: this.blogData.start_time,
          end_time: this.blogData.end_time,
          venue_name: this.blogData.venue_name,
          address: this.blogData.address,
          city: this.blogData.city,
          state: this.blogData.state,
          country: this.blogData.country,
          latitude: this.blogData.latitude,
          longitude: this.blogData.longitude,
          youtube_url: this.blogData.youtube_url,         
          meta_title: this.blogData.meta_title,
          meta_description: this.blogData.meta_description,
          meta_keywords: this.blogData.meta_keywords,          
        });
        //this.imagePreviews = resp.data.images[0].file_path;
        resp.data.images.map((item:any)=>{
          this.imagePreviews.push(item?.image_path);
        })
      }
    })
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
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

    copyImagePath(image_path:string)
    {
      this.clipboard.copy(image_path);
      this.toastr.success('Image path copied successfully');
    }

    onTitleChange() {
      const titleControl = this.eventForm.get('title');
      const metaTitleControl = this.eventForm.get('meta_title');
      
      // Only update meta title if it's empty or hasn't been manually edited
      if (titleControl && metaTitleControl && 
          (!metaTitleControl.value || metaTitleControl.pristine)) {
        metaTitleControl.setValue(titleControl.value);
      }
    }

  createEventForm() {
      return this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required]],
        short_description: [''],
        content: [''],
        start_date: ['', [Validators.required]],
        end_date: [''],
        start_time: [''],
        end_time: [''],
        venue_name: [''],
        address: [''],
        city: [''],
        state: [''],
        country: [''],
        latitude: [''],
        longitude: [''],
        youtube_url: [''],
        meta_title: ['', Validators.required],
        meta_description: [''],
        meta_keywords: [''],        
        uploaded_files: ['']
      });
    }

    saveEventForm()
    {
      
      if(this.eventForm.invalid){
        this.toastr.error('Please fill all required fields');
        return;
      }
      // if(this.eventForm.value.content==""){
      //   this.toastr.error('Please fill content field');
      //   return;
      // }      
      this.isLoading=true;
      // if(this.selectedFiles.length>0){
      //   this.eventForm.controls['uploaded_files'].setValue(this.selectedFiles);  
      // }
      this.eventForm.value.start_date = this.datePipe.transform(this.eventForm.value.start_date, 'yyyy-MM-dd');
      this.eventForm.value.end_date = this.eventForm.value.end_date?this.datePipe.transform(this.eventForm.value.end_date, 'yyyy-MM-dd'):'';
      this.masterService.saveEventInfo(this.eventForm.value, this.selectedFiles).subscribe((resp:any)=>{
        if(resp.message){
          this.isLoading=false;
          this.toastr.success(resp.message);
          this.router.navigate(['/event']);
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error(error.error.detail);
      });
    }

    saveEventImages()
    {
      let selectedFiles = this.selectedEventImg;
      if(this.eventForm.invalid){
        this.toastr.error('Please fill all required fields');
        return;
      }
      this.isLoading=true;
      if(!this.eventForm.getRawValue().id){
        this.masterService.saveEventInfo(this.eventForm.getRawValue(), this.selectedFiles).subscribe((resp:any)=>{
          if(resp.message){
            this.isLoading=false;
            this.eventForm.patchValue({
              id:resp?.data?.id
            });
            const formData = new FormData();
            formData.append('blog_id', resp?.data?.id);
            selectedFiles.forEach((file, index) => {
              formData.append('uploaded_files', file);
            });
            this.masterService.uploadDEditorImage(formData).subscribe((resp:any)=>{
              this.toastr.success(resp.message);
              this.isLoading=false;
              this.getEventDetails(this.eventForm.getRawValue().id);
            })
          }
        });
      }
      else{
        const formData = new FormData();
        formData.append('blog_id', this.eventForm.getRawValue().id);
        selectedFiles.forEach((file, index) => {
          formData.append('uploaded_files', file);
        });
        this.masterService.uploadDEditorImage(formData).subscribe((resp:any)=>{
          this.toastr.success(resp.message);
          this.isLoading=false;
          this.getEventDetails(this.eventForm.getRawValue().id);
        })
      }
      
    }
}
