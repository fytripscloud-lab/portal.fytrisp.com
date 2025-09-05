import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormArray,
  FormGroup,
  FormBuilder,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { MasterService } from '@core/service/master.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { id } from '@swimlane/ngx-datatable';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ValidationService } from '@shared/validation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditDestinationRouteComponent } from './dialogs/edit-destination-route/edit-destination-route.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule,
      BreadcrumbComponent,
      MatStepperModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      MatSelectModule,
      MatExpansionModule,
      MatChipsModule,
      MatCardModule,
      OwlDateTimeModule,
      OwlNativeDateTimeModule, 
      NgxEditorModule,
      MatProgressSpinnerModule,
      DragDropModule,
      NgxMatSelectSearchModule,
      NgFor,
      MatTooltipModule,
      NgxMaterialTimepickerModule,
      MatDatepickerModule
    ],
  providers: [DatePipe],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})

export class PackagesComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('itineraryFileInput') itineraryFileInput!: ElementRef;
  @ViewChild('activityFileInput') activityFileInput!: ElementRef;
  @ViewChild('activityForm') activityForm!: ElementRef;
  @ViewChild('stayForm') stayForm!: ElementRef;
  @ViewChild('transferForm') transferForm!: ElementRef;

  //Search control for destination
  destinationSearchCtrl = new FormControl('');
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  personCounts = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60];
  roomPrices: { [key: number]: any } = {};

  isLinear = false;
  basicInfoForm!: FormGroup;
  routeDestinationForm!: FormGroup;
  setPriceForm!: FormGroup;
  HFormGroup2!: UntypedFormGroup;
  VFormGroup1!: UntypedFormGroup;
  VFormGroup2!: UntypedFormGroup;
  currentStepIndex = 0;
  totalSteps = 4;
  isLoading: boolean = false;
  dayCount: number = 0;
  tripDuration: number = 0;
  basicInfoSaving: boolean = false;
  destinationRouteSave: boolean = false;
  destinationId: string = '';
  durationArray = Array.from({length: 30}, (_, i) => i + 1);
  minDate: Date = new Date();

  breadscrums = [
    {
      title: 'Trip Packages',
      items: ['Home'],
      active: 'Trip Packages',
    },
  ];

  facilities = [
    { value: 'transfer', label: 'Transfer Included', img: 'https://d86yd05qgcndh.cloudfront.net/icons/private-car.png' },
    { value: 'stay', label: 'Stay Included', img: 'https://d86yd05qgcndh.cloudfront.net/icons/bedroom.png' },
    { value: 'meals', label: 'Meals Included', img: 'https://d86yd05qgcndh.cloudfront.net/icons/meal.png' },
    { value: 'sightseeing', label: 'Sightseeing Included', img: 'https://d86yd05qgcndh.cloudfront.net/icons/sightseeing.png' },
    { value: 'breakfast', label: 'Breakfast Included', img: 'https://d86yd05qgcndh.cloudfront.net/icons/breakfast.png' },
  ];

  selectedFacilities: Set<string> = new Set();
  numberValue: number = 0;

  toppings = new FormControl<string[]>([]); // Initialized with an empty array
  toppingList: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Lunch or Dinner'];
  rooms = new FormControl<string[]>([]); // Initialized with an empty array
  roomsList: any = [];

  destinations: any = [];
  durations: any = [];
  categoryLists: any = [];
  routeList: any = [];
  tripRoutes: any = [];
  packageData: any;
  packageId: string = '';
  tourItineraryId: string = '';
  tripRouteId: string = '';
  selectedRooms: any = [];
  tripPrices: any = [];
  selectedRoomPrices: any[] = [];
  tripRoomSelected: any = [];
  showAddRouteForm: boolean = false;
  tripForms: FormGroup;
  selectedType: { [key: string]: string } = {};
  routeWiseHotels: any= [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  chips: string[] = [];
  saveExp: boolean = false;
  daySections: any = [];
  currentRouteIndex: number = 0;
  currentDayIndex: number = 0;
  btnSaving: boolean = false;
  private routeStartDays: { [key: number]: number } = {};
  packageImagePreviews: any = [];
  packageSelectedFiles: File[] = [];
  packageImgUploading: boolean = false;
  routeData: any ={};

  constructor(private _formBuilder: FormBuilder, private masterService: MasterService, private toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private datePipe: DatePipe, private validationService: ValidationService, public dialog: MatDialog,) {
    this.activatedRoute.queryParamMap.subscribe((param: any) => {
      if(param?.params?.package_id){
        this.packageId = param?.params?.package_id;
        this.getPackageDetails(param?.params?.package_id);
      }
      this.destinationId = param?.params?.destination_id;
    });
    this.tripForms = this._formBuilder.group({
      routes: this._formBuilder.array([])
    });
  }

  ngOnInit(): void {      
    this.activatedRoute.queryParams.subscribe(params => {
      const step = params['step'] ? parseInt(params['step'], 10) : 0;
      this.currentStepIndex = this.validateStepIndex(step);
    });
    this.activatedRoute.paramMap.subscribe((params) => {
      let package_id = params.get('package_id');
      if(package_id){
        this.packageId = package_id;
        this.getPackageDetails(package_id);
      }
    });
    //this.showAddRouteForm = !this.tripRoutes?.length;
    this.loadMasterData();
    this.createBasicForm();
    this.createDestinationForm();
    this.createSetPriceForm();    
    this.editor = new Editor();
  }

  // Method to initialize sections
  initializeSections(routeIndex: number, dayIndex: number, tour_itineraries_details:any) {
    this.currentRouteIndex = routeIndex;
    this.currentDayIndex = dayIndex;
    const activities = this.getDayForm(routeIndex, dayIndex).get('activities')?.value || [];
    const stays = this.getDayForm(routeIndex, dayIndex).get('stays')?.value || [];
    const transfers = this.getDayForm(routeIndex, dayIndex).get('transfers')?.value || [];
    const key = `${routeIndex}_${dayIndex}`;
    this.daySections[key] = tour_itineraries_details;    
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.chips.push(value);
    }
    event.chipInput!.clear();
  }

  remove(chip: string): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<string[]>, routeIndex:number, dayIndex:number) {
    this.currentRouteIndex = routeIndex;
    this.currentDayIndex = dayIndex;
    moveItemInArray(this.daySections[routeIndex + '_' + dayIndex], event.previousIndex, event.currentIndex);
    
    // Update the order in your form arrays
    this.updateFormArraysOrder();
  }

  updateFormArraysOrder() {

    const dayForm = this.getDayForm(this.currentRouteIndex, this.currentDayIndex);
    //console.log(this.daySections[this.currentRouteIndex + '_' + this.currentDayIndex]);
    const allSections = this.daySections[this.currentRouteIndex + '_' + this.currentDayIndex].map((section:any, index:number) => ({
      encrypt_id: section.id, // assuming encrypt_id exists in your data
      sort_order: index
    }));
   //console.log(allSections);
    const payload = {
      itineraries: allSections,
      tour_package_id: this.packageId, // add this property to your component
      trip_route_id: dayForm.controls['trip_route_id'].value,     // add this property to your component
      tour_itinerary_id: dayForm.controls['id'].value // add this property to your component
    };
    //console.log('Formatted payload:', payload);

    this.masterService.updateItinerariesSort(payload).subscribe({
      next: (res: any) => {
        if(res.success){
          this.toastr.success(res.message);
        }
      }
    });
  }

  async loadMasterData()
  {

    const apis = [
      this.getAllDestinationList(),
      this.getRoomLists(),
      this.getTourCategoryAllList()
    ];

    const results = [];
    for (const apiCall of apis) {
      try {
        //this.loading = true; // Show loading for current API
        const result = await apiCall;
        results.push(result);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        //this.loading = false; // Hide loading for current API
      }
    }
    return results;
  }

  dayCounNumber: number = 0;
  getDayCount(day: number): number {
    return this.dayCounNumber + day + 1;
  }

  getAllDestinationList(){
    this.masterService.getAllDestinationList().subscribe({
      next: (res: any) => {
        this.destinations = res.data;  
        this.filteredDestinations$.next(this.destinations);
        this.destinationSearchCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(search => {
          if (!search) {
            this.filteredDestinations$.next(this.destinations.slice());
            return;
          }
          
          // Filter the destinations
          const destinationSearchCtrl = search.toLowerCase();
          const filtered = this.destinations.filter((destination: { name: string; }) => 
            destination.name.toLowerCase().includes(destinationSearchCtrl)
          );
          this.filteredDestinations$.next(filtered);
        });      
      }
    });
  }

  getRoomLists()
  {
    this.masterService.getAllRooms().subscribe({
      next: (res: any) => {
        this.roomsList = res.data;
      }
    });
  }

  getTourCategoryAllList()
  {
    this.masterService.getTourCategoryAllList().subscribe({
      next: (res: any) => {
        this.categoryLists = res.data;        
      }
    });
  }

  onDestinationChange(event: MatSelectChange) {
    //this.getDurationById(event.value);    
  }

  getDurationById(destinationId:any)
  {
    this.masterService.getDurationByDestination(destinationId).subscribe((resp:any)=>{
      this.durations = resp.data;
    })
  }

  getRouteByDestination(destinationId: any)
  {
    this.masterService.getRouteByDestination(destinationId).subscribe((resp:any)=>{
      this.routeList = resp.data;
    })
  }

  updateDayIndex(day: number) {
    this.currentDayIndex += day;
    return this.currentDayIndex
  }

  onPackageImageSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const result = this.validationService.validateImageFile(file);
        if (!result.isValid) {
          this.toastr.error(result.message);
          return;
        }
        this.packageSelectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.packageImagePreviews.push({img:e.target.result, id:''});
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePackageImage(image:any, index: number) {
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
          this.packageImagePreviews.splice(index, 1);
          this.packageSelectedFiles.splice(index, 1);
          if(image.id){
            this.masterService.deleteTourPackageImage(image.id).subscribe((resp:any)=>{
              this.toastr.success(resp.message);
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      });
      
    }

  async getPackageDetails(packageId:any, isLoad:boolean=true)
  {
    
    this.isLoading=isLoad;
    this.masterService.tourPackageInfo(packageId).subscribe({
      next: (res: any) => {
        if(res.data){
          this.packageData = res.data;
          //this.getDurationById(res.data?.destination?.id);  
          //this.getRouteByDestination(res.data?.destination?.id);
          this.tripDuration = res.data?.number_of_days;
          //this.getDurationById(res.data?.trip_duration?.id); 
          //const selectedFacilities = res.data?.facilities_json.map((item:any) => item);
          const selectedDestination = res.data?.destination_list.map((item:any) => item?.destination?.id);
          this.getRouteByDestination(selectedDestination.join(','));
          const selectedCategories = res.data?.category_list.map((item:any) => item?.category?.id);
          const selectedFacilities = Array.isArray(res.data?.facilities_json) 
          ? res.data.facilities_json.map((item:any) => item?.value)
          : [];
          const selectedRoomIds = res.data?.tour_selected_rooms.map((item:any) => item?.room?.id);
          //const selectedInclusion = res.data?.tour_inclusions.map((item:any) => item.item);
          const selectedGroupDate = res.data?.grouptour_dates_json;
          this.setGrouptourDate(selectedGroupDate);
          const selectedInclusion = res.data?.tour_inclusions.map((item: any) => ({
            id: item.id, // assuming your API returns an id field
            text: item.item
          }));
          this.setInclusions(selectedInclusion);
          const selectedExclusion = res.data?.tour_exclusions.map((item: any) => ({
            id: item.id, // assuming your API returns an id field
            text: item.item
          }));
          this.setExclusions(selectedExclusion);
           const selectedPolicy = res.data?.tour_cancelation_policies.map((item: any) => ({
            id: item.id, // assuming your API returns an id field
            min_days: item.min_days,
            max_days: item.max_days,
            percentage: item.percentage,
            policy: item.policy
          }));
          if(selectedPolicy.length>0){
            this.setCancelationPolicy(selectedPolicy);
          }          
          
          this.tripRoutes = res.data?.trip_routes;
          this.selectedRooms = res.data?.tour_selected_rooms;
          this.tripPrices = res.data?.trip_prices;
          const selectedTripprice = res.data?.trip_prices.map((item:any) => item.room.id);
          this.tripRoomSelected = selectedTripprice;
          //this.chips = res.data?.meta_tags.split(',');          
          this.basicInfoForm.patchValue({
            id: res.data?.id,
            category_ids: selectedCategories,
            destination_ids: selectedDestination,
            number_of_days: res.data?.number_of_days,
            //trip_duration_id: res.data?.trip_duration?.id,
            package_name: res.data?.package_name,
            package_type: res.data?.package_type,
            //number_of_days: res.data?.number_of_days.toString(),
            //number_of_nights: res.data?.number_of_nights.toString(),
            facilities_json: selectedFacilities,
            room_ids: selectedRoomIds,                   
            trip_highlights: res.data?.trip_highlights,
            meta_title: res.data?.meta_title,
            meta_description: res.data?.meta_description,
            meta_keywords: res.data?.meta_keywords,            
            meta_tags: res.data?.meta_tags,
            // inclusions: JSON.parse(res.data?.inclusions),
            // exclusions: JSON.parse(res.data?.exclusions),
            // trip_highlights: JSON.parse(res.data?.trip_highlights)
          });
          this.packageImagePreviews=[];
          if(res.data?.tour_images?.length>0){
            res.data?.tour_images.map((image: any) => {
              this.packageImagePreviews.push({img:image.file_path+'?w=130&h=130', id:image.id, alt_text:image.image_alt});
            });
          }
          
          if (this.tripRoutes?.length) {
            let routeIndex = 0;
            this.dayCount = 0;
            this.tripRoutes.forEach((route: any) => {
              const routeFormArray = this.getRoutes();
              routeFormArray.push(this.createRouteForm(route.no_of_days_stay));
              this.dayCount += route.no_of_days_stay;
               // Set this based on your logic
              this.setTripData(route, routeIndex);
              routeIndex++;
            });
          }else{
            this.showAddRouteForm=true;
          }
        }
      },
      error: (error) => {        
        this.toastr.error('Uanble to load data from server.');
        this.router.navigateByUrl('/trip-packages');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onRoomCategoryChange(event: MatSelectChange) {    
    const selectedRoomId = event.value;
    this.getRouteWiseHotels(this.routeData.route.id, selectedRoomId);
  }

  getRouteWiseHotels(routeId:any, roomId:string)
  {
    this.routeWiseHotels=[];
    this.masterService.getRouteWiseHotels(routeId, roomId).subscribe({
      next: (res: any) => {
        this.routeWiseHotels = res.data;
      },
      error: (error) => {
        this.toastr.error(error.error.detail);
      }
    });
  }

  setTripData(data: any, routeIndex: number) {
    // Assuming data is an array of trip details
    const tour_itineraries = data.tour_itineraries;
    let dayIndex=0;
    tour_itineraries.forEach((tripData: any) => {
      // Find the corresponding day form based on day_number
      //const dayIndex = tripData.day_number - 1; // Convert to 0-based index
      
      const dayForm = this.getDayForm(routeIndex, dayIndex);
      if (dayForm) {
        // Set the values in the form
        dayForm.patchValue({
          id: tripData.id,
          trip_route_id: data.id,
          isSaved: true, // Since we're loading saved data
          tripDetails: {
            title: tripData.title,
            description: tripData.description
          }
        });
  
        // If you have tour_itineraries_details, you can set those as well
        if (tripData.tour_itineraries_details && tripData.tour_itineraries_details.length > 0) {
          // Handle activities, stays, and transfers here
          //this.setTourItinerariesDetails(routeIndex, dayIndex, data, tripData);
          this.initializeSections(routeIndex, dayIndex, tripData.tour_itineraries_details);
        }
        dayIndex++;
      }
    });
  }

  onStepChange(index: number) {
    // Update URL when step changes
    if(index>0 && this.packageId==''){
      return;
    }
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { step: index },
      queryParamsHandling: 'merge'
    });
  }

  private validateStepIndex(index: number): number {
    // Ensure step index is within valid range
    return Math.max(0, Math.min(index, this.totalSteps - 1));
  }

  setCancelationPolicy(policy_data:any)
  {
    this.cancellationPolicyArray.clear();
    if(policy_data){
      policy_data.forEach((policy:any) => {
        this.cancellationPolicyArray.push(this.createCancellationPolicy({id:policy.id, min_days:policy.min_days, max_days:policy.max_days, percentage:policy.percentage, policy:policy.policy}));
      });

      if (this.cancellationPolicyArray.length > 1) {
        const firstGroup = this.cancellationPolicyArray.at(0) as FormGroup;
        const textControl = firstGroup.get('policy');
        if (textControl) {
          textControl.clearValidators();
          textControl.updateValueAndValidity();
        }
      }

      this.cancellationPolicyArray.updateValueAndValidity();
    }
  }

  setGrouptourDate(group_dates: any)
  {
    this.grouptourArray.clear();
    if(group_dates){
      group_dates.forEach((group_date:any) => {
        this.grouptourArray.push(this.createGroupTourDate({date:group_date}));
      });
  
      if (this.grouptourArray.length > 1) {
        const firstGroup = this.grouptourArray.at(0) as FormGroup;
        const textControl = firstGroup.get('tour_date');
        if (textControl) {
          textControl.clearValidators();
          textControl.updateValueAndValidity();
        }
      }
  
      this.grouptourArray.updateValueAndValidity();
    }
    
  }

  setInclusions(inclusions: string[]) {
    this.inclusionsArray.clear();
    inclusions.forEach((inclusion:any) => {
      // const control = this._formBuilder.group({
      //   id: [exclusion.id],
      //   text: [exclusion.text, Validators.required]
      // });
      this.inclusionsArray.push(this.createInclusion({id:inclusion.id, text:inclusion.text}));
    });

    if (this.inclusionsArray.length > 1) {
      const firstGroup = this.inclusionsArray.at(0) as FormGroup;
      const textControl = firstGroup.get('text');
      if (textControl) {
        textControl.clearValidators();
        textControl.updateValueAndValidity();
      }
    }
  
    this.inclusionsArray.updateValueAndValidity();
  }

  setExclusions(exclusion: any) { 
    this.exclusionsArray.clear();
    exclusion.forEach((exclusion:any) => {
      // const control = this._formBuilder.group({
      //   id: [exclusion.id],
      //   text: [exclusion.text, Validators.required]
      // });
      this.exclusionsArray.push(this.createExclusion({id:exclusion.id, text:exclusion.text}));
    });

    if (this.exclusionsArray.length > 1) {
      const firstGroup = this.exclusionsArray.at(0) as FormGroup;
      const textControl = firstGroup.get('text');
      if (textControl) {
        textControl.clearValidators();
        textControl.updateValueAndValidity();
      }
    }
  
    this.exclusionsArray.updateValueAndValidity();
  }

  createBasicForm() {
    this.basicInfoForm = this._formBuilder.group({
      id: [''],
      destination_ids: [{value: [this.destinationId], disabled: (this.packageId?true:false)}, Validators.required],
      category_ids: ['', Validators.required],
      //trip_duration_id: [{value: '', disabled: (this.packageId?true:false)}, Validators.required],
      package_name: ['', [Validators.required, Validators.minLength(3)]],
      package_type: ['', Validators.required],
      number_of_days: [{value: '', disabled: (this.packageId?true:false)}, Validators.required],
      number_of_nights: [''],
      facilities_json: ['', Validators.required],
      room_ids: ['', Validators.required],
      grouptour_dates_json: this._formBuilder.array([this.createGroupTourDate()]),
      inclusions: this._formBuilder.array([this.createInclusion()]),
      exclusions: this._formBuilder.array([this.createExclusion()]),
      trip_highlights: ['', Validators.required],
      meta_title: ['', Validators.required],
      meta_description: [''],
      meta_keywords: [''],
      meta_tags: [''],
      cancelation_policies: this._formBuilder.array([this.createCancellationPolicy({id:'', min_days:28, percentage:100, policy:'From the date of booking – 28 Days prior to departure 100% of tour cost'}), this.createCancellationPolicy({id:'', min_days:21, percentage:75, policy:'From the date of booking – 21 Days prior to departure 75% of tour cost'}), this.createCancellationPolicy({id:'', min_days:14, percentage:50, policy:'14 -07 Days prior to departure 50% of tour cost'}),this.createCancellationPolicy({id:'', min_days:7, percentage:100, policy:'07 days prior to departure or No show 100% of tour cost'})]),
    });
  }

  createCancellationPolicy(data:any) {
    let policy_text = data?.policy || data?.min_days+' days before '+data?.percentage+'% refund';
    return this._formBuilder.group({
      id: [data?.id||''],
      min_days: [data?.min_days||0, [
        Validators.required,
        Validators.min(0),
        Validators.max(60)  // Maximum 60 days
      ]],
      max_days: [data?.max_days||0, [
        Validators.required,
        Validators.min(0),
        Validators.max(60)  // Maximum 60 days
      ]],
      percentage: [data?.percentage||0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)  // Maximum 100%
      ]],
      policy: [policy_text, [Validators.required]]
    });
  }

  updatePolicyText(index: number) {
    const policyGroup = this.cancellationPolicyArray.at(index) as FormGroup;
    const daysBeforeValue = policyGroup.get('min_days')?.value;
    const daysAfterValue = policyGroup.get('max_days')?.value;
    const percentageValue = policyGroup.get('percentage')?.value;
    let text = '';
    if(index==0){
      text = 'From the date of booking – '+daysAfterValue+' Days prior to departure '+percentageValue+'% of tour cost';
    }
    if(index==1){
      text = 'From the date of booking – '+daysAfterValue+' Days prior to departure '+percentageValue+'% of tour cost';
    }
    if(index==2){
      text = daysBeforeValue+' -'+daysAfterValue+' Days prior to departure '+percentageValue+'% of tour cost';
    }
    if(index==3){
      text = daysAfterValue+' days prior to departure or No show '+percentageValue+'% of tour cost';
    }
    
    if (daysBeforeValue !== null && daysBeforeValue !== undefined && 
        percentageValue !== null && percentageValue !== undefined) {
      const policyText = text;
      policyGroup.get('policy')?.setValue(policyText);
    }
  }

  createGroupTourDate(dates?: {date: string }) {
  // Get the current package type value safely
  const packageType = this.basicInfoForm?.get('package_type')?.value;
  
  // Set validators based on package type
  const validators = packageType == 'Group Tour' ? Validators.required : null;
  
  return this._formBuilder.group({
    tour_date: [dates?.date || '']
  });
}

  createInclusion(inclusion?: { id: number; text: string }) {
    //return this._formBuilder.control('', Validators.required);
    return this._formBuilder.group({
      id: [inclusion?.id || null],
      text: [inclusion?.text || '', Validators.required]
    });
  }

  createExclusion(exclusion?: { id: number; text: string }) {
    return this._formBuilder.group({
      id: [exclusion?.id || null],
      text: [exclusion?.text || '', Validators.required]
    });
  }

  get cancellationPolicyArray() {
    return this.basicInfoForm.get('cancelation_policies') as FormArray;
  }

  get grouptourArray() {
    return this.basicInfoForm.get('grouptour_dates_json') as FormArray;
  }

  get inclusionsArray() {
    return this.basicInfoForm.get('inclusions') as FormArray;
  }

  get exclusionsArray() {
    return this.basicInfoForm.get('exclusions') as FormArray;
  }

  addGroupTourDate() {
    this.grouptourArray.push(this.createGroupTourDate());
  }

  addInclusion() {
    this.inclusionsArray.push(this.createInclusion());
  }

  addExclusion() {
    this.exclusionsArray.push(this.createExclusion());
  }

  removeGrouptour(index: number) {

    const group_tour = this.grouptourArray.at(index).value;
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
          if (group_tour && group_tour.id) {
            // this.masterService.deleteiInclusion(group_tour.id).subscribe({
            //   next: () => {
            //     this.inclusionsArray.removeAt(index);
            //   },
            //   error: (error) => {
            //     console.error('Error deleting exclusion:', error);
            //     this.toastr.error('Error deleting exclusion');
            //     // Handle error (show error message)
            //   }
            // });
          } else {
            if (this.grouptourArray.length > 1) {
              this.grouptourArray.removeAt(index);
            }
          }   
          if (this.grouptourArray.length == 1) {
            const firstGroup = this.grouptourArray.at(0) as FormGroup;
            const textControl = firstGroup.get('tour_date');
            if (textControl) {
              textControl.setValidators(Validators.required);
              textControl.updateValueAndValidity();
            }
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.toastr.success('Date deleted successfully');
        }
      });
    }

  removeInclusion(index: number) {

  const inclusion = this.inclusionsArray.at(index).value;
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
        if (inclusion && inclusion.id) {
          this.masterService.deleteiInclusion(inclusion.id).subscribe({
            next: () => {
              this.inclusionsArray.removeAt(index);
            },
            error: (error) => {
              console.error('Error deleting exclusion:', error);
              this.toastr.error('Error deleting exclusion');
              // Handle error (show error message)
            }
          });
        } else {
          if (this.inclusionsArray.length > 1) {
            this.inclusionsArray.removeAt(index);
          }
        }   
        if (this.inclusionsArray.length == 1) {
          const firstGroup = this.inclusionsArray.at(0) as FormGroup;
          const textControl = firstGroup.get('text');
          if (textControl) {
            textControl.setValidators(Validators.required);
            textControl.updateValueAndValidity();
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.toastr.success('Inclusion deleted successfully');
      }
    });
  }

  removeExclusion(index: number) {     
    const exclusion = this.exclusionsArray.at(index).value;
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
        if (exclusion && exclusion.id) {
          this.masterService.deleteExclusion(exclusion.id).subscribe({
            next: () => {
              this.exclusionsArray.removeAt(index);
            },
            error: (error) => {
              console.error('Error deleting exclusion:', error);
              this.toastr.error('Error deleting exclusion');
              // Handle error (show error message)
            }
          });
        } else {
          if (this.exclusionsArray.length > 1) {
            this.exclusionsArray.removeAt(index);
          }
        }   
        if (this.exclusionsArray.length == 1) {
          const firstGroup = this.exclusionsArray.at(0) as FormGroup;
          const textControl = firstGroup.get('text');
          if (textControl) {
            textControl.setValidators(Validators.required);
            textControl.updateValueAndValidity();
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.toastr.success('Exclusion deleted successfully');
      }
    });
  }

  createRouteForm(numberOfDays: number): FormGroup {
    return this._formBuilder.group({
      days: this._formBuilder.array(
        Array(numberOfDays).fill(null).map(() => this.createDayForm())
      )
    });
  }
  createDayForm(): FormGroup {
    return this._formBuilder.group({
      id:[],
      trip_route_id:[],
      isSaved: [false],
      isEdit: [false],
      tripDetails: this._formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required]
      }),
      activities: this._formBuilder.array([]),
      stays: this._formBuilder.array([]),
      transfers: this._formBuilder.array([])      
    });
  }

  getRoutes(): FormArray {
    return this.tripForms.get('routes') as FormArray;
  }

  getDays(routeIndex: number): FormArray {
    return this.getRoutes().at(routeIndex).get('days') as FormArray;
  }

  getDayForm(routeIndex: number, dayIndex: number): FormGroup {
    return this.getDays(routeIndex).at(dayIndex) as FormGroup;
  }

  getActivities(routeIndex: number, dayIndex: number): FormArray {
    return this.getDayForm(routeIndex, dayIndex).get('activities') as FormArray;
  }

  getStays(routeIndex: number, dayIndex: number): FormArray {
    return this.getDayForm(routeIndex, dayIndex).get('stays') as FormArray;
  }

  getTransfers(routeIndex: number, dayIndex: number): FormArray {
    return this.getDayForm(routeIndex, dayIndex).get('transfers') as FormArray;
  }

  getHalts(transfer: AbstractControl): FormArray {
    return transfer.get('halts') as FormArray;
  }

  createHaltFormGroup(): FormGroup {
    return this._formBuilder.group({
      halt_location: ['', Validators.required]
    });
  }

  addHalt(transfer: AbstractControl) {
    const halts = this.getHalts(transfer);
    halts.push(this.createHaltFormGroup());
  }

  // Method to remove a halt
  removeHalt(transfer: AbstractControl, haltIndex: number) {
    const halts = this.getHalts(transfer);
    halts.removeAt(haltIndex);
  }

  createActivityForm(dayIndex:number): FormGroup {
    return this._formBuilder.group({
      activityDetails: this._formBuilder.group({
        tour_package_id: [''],
        trip_route_id: [''],
        tour_itinerary_id: [''],
        activity_title: ['', Validators.required],
        day_number: [dayIndex],
      }),
      images: this._formBuilder.array([]),
      activityImages: this._formBuilder.array([]),
      add_new: true
    });
  }

  createActivityImageGroup(): FormGroup {
    return this._formBuilder.group({
      experiences: ['', Validators.required],
      experience_files: [null],
      preview: [''],
      imageUrl: ['']
    });
  }

  createTransferFormGroup(): FormGroup {
    return this._formBuilder.group({
      tour_package_id: [''],
      trip_route_id: [''],
      tour_itinerary_id: [''],
      transfer_title: [''],
      day_number: [''],
      transfer_type: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      pickup_location: ['', Validators.required],
      dropoff_location: ['', Validators.required],
      halts: this._formBuilder.array([]),
      add_new: true
    });
  }

  createStayForm(): FormGroup {
    return this._formBuilder.group({
      hotelName: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      roomType: ['', Validators.required],
      add_new: true
    });
  }

  getActivityImagesArray(routeIndex: number, dayIndex: number, activityIndex: number): FormArray {
    return this.getActivityForm(routeIndex, dayIndex, activityIndex).get('activityImages') as FormArray;
  }

  saveActivityExperience(routeIndex: number, dayIndex: number, activityIndex: number, imageIndex:number)
  {
    //this.btnSaving = true;
    if (!this.isActivityImageValid(routeIndex, dayIndex, activityIndex)) {
      return;
    }
    const activityForm = this.getActivityForm(routeIndex, dayIndex, activityIndex);
    const activityData = activityForm.value; 
    const formData = new FormData();
    //activityData.id?formData.append('id', activityData.id):'';
    formData.append('tour_itinerary_id', activityData.activityDetails.tour_itinerary_id);
    formData.append('tour_activity_id', activityData.id);
    if (activityData.activityImages[imageIndex]) {
      if (activityData.activityImages[imageIndex].experiences) {
        formData.append('experience_title', activityData.activityImages[imageIndex].experiences);
        if(activityData.activityImages[imageIndex].experience_files){
          formData.append('uploaded_file', activityData.activityImages[imageIndex].experience_files);
        }
        
        activityData.activityImages[imageIndex]?.experience_id?formData.append('id', activityData.activityImages[imageIndex].experience_id):'';
      }
    }
    
    this.masterService.addUpdateTourActivityExperience(formData).subscribe({
      next: (response:any) => {
        this.btnSaving = false;
        this.toastr.success('Activity saved successfully!');
        const activityImagesArray = this.getActivityImagesArray(routeIndex, dayIndex, activityIndex).at(imageIndex);
        // activityImagesArray = this._formBuilder.group({
        //   experience_id: response.id,
        //   experience_title: [response.experience_title],
        //   experiences: [response.experience_title],
        //   preview: [response.file_path+'?im=Resize=(130,130)'],
        //   file: [null]
        // });
        activityImagesArray.patchValue({
          experience_id: response.data.id,
          experience_title: response.data.experience_title,
          experiences: response.data.experience_title,
          preview: response.data.file_path+'?im=Resize=(130,130)',          
        });
        //this.addActivityImage(routeIndex, dayIndex, activityIndex);
        this.saveExp = true;
        this.getPackageDetails(this.packageId, false);
      },
      error: (error) => {
        this.btnSaving = false;        
        console.error('Error saving activity', error);
        // Show error message        
        //this.toastr.error('Error saving activity');
        if (error.status === 413) {
          this.toastr.error('File size too large. Please try a smaller file or contact administrator.');
        } else {
          this.toastr.error('Error saving activity');
        }
      }
    });
  }

  // Add new activity image
  addActivityImage(routeIndex: number, dayIndex: number, activityIndex: number) {
    const activityImagesArray = this.getActivityImagesArray(routeIndex, dayIndex, activityIndex);
    activityImagesArray.push(this.createActivityImageGroup());
    this.saveExp=false;
  }

  // Remove activity image
  removeActivityImage(routeIndex: number, dayIndex: number, activityIndex: number, imageIndex: number) {
    const activityImagesArray = this.getActivityImagesArray(routeIndex, dayIndex, activityIndex);
    
    if(activityImagesArray.at(imageIndex).value?.experience_id){
      this.masterService.deleteTourActivityExperience(activityImagesArray.at(imageIndex).value.experience_id).subscribe((resp:any)=>{
        this.toastr.success(resp.message);
      })
    }
    activityImagesArray.removeAt(imageIndex);
  }

  getActivityForm(routeIndex: number, dayIndex: number, activityIndex: number) {
    const routes = this.tripForms.get('routes') as FormArray;
    const days = routes.at(routeIndex).get('days') as FormArray;
    const activities = days.at(dayIndex).get('activities') as FormArray;
    return activities.at(activityIndex);
  }

  getItineraryImages(routeIndex: number, dayIndex: number, activityIndex: number): FormArray {
    return this.getActivityForm(routeIndex, dayIndex, activityIndex).get('images') as FormArray;
  }

  createImageControl(file: File, preview: string): FormGroup {
    return this._formBuilder.group({
      file: [file],
      preview: [preview]
    });
  }

  

  // Add methods
  addActivity(routeIndex: number, dayIndex: number, dayNumber:number) {
    const activities = this.getActivities(routeIndex, dayIndex);
    //activities.push(this.createActivityForm(dayIndex));
    

     // Close any open stay forms
    const stays = this.getStays(routeIndex, dayIndex);
    stays.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });

    // Close any open transfer forms
    const transfers = this.getTransfers(routeIndex, dayIndex);
    transfers.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });

    const openForms = activities.controls.some(control => control.get('add_new')?.value);
    if(openForms){
      return;
    }
    
    const dayForm = this.getDayForm(routeIndex, dayIndex);   
    const newActivity = this._formBuilder.group({
      id:[''],
      activityDetails: this._formBuilder.group({
        tour_package_id: [this.packageId],
        trip_route_id: [dayForm.controls['trip_route_id'].value],
        tour_itinerary_id: [dayForm.controls['id'].value],
        activity_title: ['', Validators.required],
        day_number: [dayNumber],
        add_new: true
      }),
      images: this._formBuilder.array([]),
      activityImages: this._formBuilder.array([]),
      add_new: true,
      delete_id:['']
    });
    //activities.clear();
    activities.push(newActivity);
    //this.getStays(routeIndex, dayIndex).clear();
    //this.getTransfers(routeIndex, dayIndex).clear();
  }

  closeActivity(routeIndex: number, dayIndex: number, activityIndex: number){
    const dayForm = this.getDayForm(routeIndex, dayIndex);
    const activities = dayForm.get('activities') as FormArray;
    const activityForm = this.getActivityForm(routeIndex, dayIndex, activityIndex);
    if(activities.controls[activityIndex].value.id){
      activityForm.patchValue({
        add_new: false
      });
    }else{
      activities.removeAt(activityIndex);
    }
    //activities.removeAt(activityIndex);
  }

  editActivity(routeIndex: number, dayIndex: number, activityData:any) {
    this.closeAllOpenForms(routeIndex, dayIndex);
    //const activityForm = this.getActivityForm(routeIndex, dayIndex, 0);
    // const activityData = activityForm.value;
    // activityForm.enable();
    // activityForm.patchValue({
    //   add_new: true
    // });
    // if (activityData.activityImages && activityData.activityImages.length > 0) {
    // }else{
    //   this.addActivityImage(routeIndex, dayIndex, activityIndex);
    // }
    // this.activityForm.nativeElement.scrollIntoView({ 
    //   behavior: 'smooth',
    //   block: 'start'
    // });
    const editForm = document.getElementById(`boxroutebutton-${routeIndex}-${dayIndex}`);
    if (editForm) {
      editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const activities = this.getActivities(routeIndex, dayIndex);
     // Close any open stay forms
    const stays = this.getStays(routeIndex, dayIndex);
    stays.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });

    // Close any open transfer forms
    const transfers = this.getTransfers(routeIndex, dayIndex);
    transfers.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });

    const openForms = activities.controls.some(control => control.get('add_new')?.value);
    if(openForms){
      return;
    }
    
    const dayForm = this.getDayForm(routeIndex, dayIndex);   
    const newActivity =this._formBuilder.group({
      id: activityData.tour_activity.id,
      activityDetails: this._formBuilder.group({
        activity_title: [activityData.tour_activity.activity_title],
        tour_package_id: [this.packageId],
        trip_route_id: [dayForm.controls['trip_route_id'].value],
        tour_itinerary_id: [dayForm.controls['id'].value],
      }),
      images: this._formBuilder.array([]),
      activityImages: this._formBuilder.array([]),
      add_new: true,
      delete_id: activityData.id
    });
    //activities.clear();
    // Set images if any
    if (activityData.tour_activity.tour_activity_images) {
      activityData.tour_activity.tour_activity_images.forEach((image: any) => {
        const imagesArray = newActivity.get('images') as FormArray;
        imagesArray.push(this._formBuilder.group({
          id: image.id,          
          preview: [image.file_path+'?im=Resize=(130,130)'],
          file: [null]
        }));
      });
    }
    if (activityData.tour_activity.tour_activity_experiences) {
      activityData.tour_activity.tour_activity_experiences.forEach((image: any) => {
        const activityImagesArray = newActivity.get('activityImages') as FormArray;
        activityImagesArray.push(this._formBuilder.group({
          experience_id: image.id,
          experience_title: [image.experience_title],
          experiences: [image.experience_title],
          preview: [image.file_path+'?im=Resize=(130,130)'],
          experience_files: [null]
        }));
      });
    }
    activities.push(newActivity);
    
    //  this.activityForm.nativeElement.scrollIntoView({ 
    //   behavior: 'smooth',
    //   block: 'nearest'
    // });
  }

  editStay(routeIndex: number, dayIndex: number, routeData:any, stayData:any, dayNumber:number) {
    this.closeAllOpenForms(routeIndex, dayIndex);
    this.routeData = routeData;
    // const satayForm = this.getStayControl(routeIndex, dayIndex, stayIndex);
    // satayForm.enable();
    // satayForm.patchValue({
    //   add_new: true
    // });
    const editForm = document.getElementById(`boxroutebutton-${routeIndex}-${dayIndex}`);
    if (editForm) {
      editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const stays = this.getStays(routeIndex, dayIndex);
    // Close any open activity forms
    const activities = this.getActivities(routeIndex, dayIndex);
    activities.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });

    // Close any open transfer forms
    const transfers = this.getTransfers(routeIndex, dayIndex);
    transfers.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });
    const openForms = stays.controls.some(control => control.get('add_new')?.value);
    if(openForms){
      return;
    }

    // const [time, period] = stayData.tour_stay.check_in_time.split(' ');
    // const [hours, minutes] = time.split(':');
    // const date = new Date();
    // date.setHours(period === 'PM' ? parseInt(hours) + 12 : parseInt(hours));
    // date.setMinutes(parseInt(minutes));
    // const [time1, period1] = stayData.tour_stay.check_out_time.split(' ');
    // const [hours1, minutes1] = time1.split(':');
    // const date1 = new Date();
    // date1.setHours(period1 === 'PM' ? parseInt(hours1) + 12 : parseInt(hours1));
    // date1.setMinutes(parseInt(minutes1));
    this.getRouteWiseHotels(routeData.route.id, stayData.tour_stay.room.id);
    const selectedHotels = stayData.tour_stay?.tour_stay_hotels.map((item:any) => item.hotel.id);
    const selectedMeals = [];
    if(stayData.tour_stay.is_breakfast){
      selectedMeals.push('is_breakfast');
    }
    if(stayData.tour_stay.is_lunch){
      selectedMeals.push('is_lunch');
    }
    if(stayData.tour_stay.is_dinner){
      selectedMeals.push('is_dinner');
    }
    if(stayData.tour_stay.is_dinner_or_lunch){
      selectedMeals.push('is_dinner_or_lunch');
    }

    const dayForm = this.getDayForm(routeIndex, dayIndex);    
    // Create the form group using FormBuilder
    const newStayForm = this._formBuilder.group({
      id: stayData.tour_stay?.id,
      tour_package_id: [this.packageId],
      trip_route_id: [dayForm.controls['trip_route_id'].value],
      tour_itinerary_id: [dayForm.controls['id'].value],
      day_number: dayNumber,
      stay_title: stayData.tour_stay.stay_title,
      check_in_time:stayData.tour_stay.check_in_time,
      check_out_time: stayData.tour_stay.check_out_time,
      no_of_night_stay: stayData.tour_stay.no_of_night_stay.toString(),
      // Initialize boolean controls with FormControl
      is_breakfast: stayData.tour_stay.is_breakfast,
      is_lunch: stayData.tour_stay.is_lunch,
      is_dinner: stayData.tour_stay.is_dinner,
      is_dinner_or_lunch: stayData.tour_stay.is_dinner_or_lunch,
      room_title: stayData.tour_stay.room.name,
      room_id: stayData.tour_stay.room.id,
      hotels: [selectedHotels],
      meals: [selectedMeals],
      add_new: true,
      delete_id: stayData.id
    });

    stays.push(newStayForm);

    // this.stayForm.nativeElement.scrollIntoView({ 
    //   behavior: 'smooth',
    //   block: 'start'
    // });
  }

  editTransfer(routeIndex: number, dayIndex: number, stayIndex: number, rowData:any, dayNumber:number) {

    this.closeAllOpenForms(routeIndex, dayIndex);
    // const transferForm = this.getTransferControl(routeIndex, dayIndex, stayIndex);
    // transferForm.enable();
    // transferForm.patchValue({
    //   add_new: true
    // });
    const editForm = document.getElementById(`boxroutebutton-${routeIndex}-${dayIndex}`);
    if (editForm) {
      editForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    const detail = rowData;
    const dayForm = this.getDayForm(routeIndex, dayIndex);
    const transferFormArray = dayForm.get('transfers') as FormArray;
    const newTransfer = this._formBuilder.group({
      id: detail.tour_transfer.id,
      tour_package_id: [this.packageId],
      trip_route_id: [dayForm.controls['trip_route_id'].value],
      tour_itinerary_id: [dayForm.controls['id'].value],
      day_number: dayNumber,
      transfer_title: detail.tour_transfer.transfer_title,         
      transfer_type: detail.tour_transfer.transfer_type,      
      vehicle_type: detail.tour_transfer?.details?.vehicle_type,
      pickup_location: detail.tour_transfer?.details?.pickup_location,
      dropoff_location: detail.tour_transfer?.details?.dropoff_location,
      halts: this._formBuilder.array([]),
      add_new: true,
      delete_id: detail.id
    });

    transferFormArray.push(newTransfer);
    const halts = this.getHalts(newTransfer);
    rowData.tour_transfer?.details?.halts.map((halt: any) => {
      halts.push(this._formBuilder.group({
        halt_location: [halt?.halt_location, Validators.required]
      }));
    });
    

    // this.transferForm.nativeElement.scrollIntoView({ 
    //   behavior: 'smooth',
    //   block: 'start'
    // });
  }

  private closeAllOpenForms(routeIndex: number, dayIndex: number) {
    // Close activity forms
    const activities = this.getActivities(routeIndex, dayIndex);
    activities.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });
  
    // Close stay forms
    const stays = this.getStays(routeIndex, dayIndex);
    stays.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });
  
    // Close transfer forms
    const transfers = this.getTransfers(routeIndex, dayIndex);
    transfers.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });
  }

  resetTActivityForm(routeIndex: number, dayIndex: number) {
    const activities = this.getActivities(routeIndex, dayIndex);
    activities.clear();
    activities.push(this.createActivityForm(dayIndex));
  }

  resetStayForm(routeIndex: number, dayIndex: number) {
    const stays = this.getStays(routeIndex, dayIndex);
    stays.clear();
    stays.push(this.createStayForm());
  }

  createImageFormGroup(file: File, preview: string): FormGroup {
    return this._formBuilder.group({
      file: [file],
      preview: [preview]
    });
  }

  async onFileSelected(
    event: any, 
    routeIndex: number, 
    dayIndex: number, 
    activityIndex: number
  ) {
    const files = event.target.files;
    if (files) {
      const imagesArray = this.getItineraryImages(routeIndex, dayIndex, activityIndex);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = this.validationService.validateImageFile(file);
        if (!result.isValid) {
          this.toastr.error(result.message);
          return;
        }
        
        const preview = await this.createImagePreview(file);
        imagesArray.push(this.createImageControl(file, preview));
      }
    }
    this.itineraryFileInput.nativeElement.value = '';
  }

  private validateFile(file: File): FileValidationResult {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        message: 'Please upload only image files'
      };
    }
  
    // Check file size
    const maxSizeInBytes = 500 * 1024; // 300KB
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        message: `Image size must be less than 500KB. Current size: ${(file.size / 1024).toFixed(2)}KB`
      };
    }
  
    // All validations passed
    return {
      isValid: true
    };
  }

  async onActivityImageSelected(
    event: any,
    routeIndex: number,
    dayIndex: number,
    activityIndex: number,
    imageIndex: number
  ) {
    const file = event.target.files[0];
    const result = this.validationService.validateImageFile(file);
    if (!result.isValid) {
      this.toastr.error(result.message);
      return;
    }
    if (file && file.type.startsWith('image/')) {
      const preview = await this.createImagePreview(file);
      const activityImage = this.getActivityImagesArray(routeIndex, dayIndex, activityIndex).at(imageIndex);
      if(activityImage){
        const updatedValue = {
          experience_files: file,
          preview: preview
        };
        activityImage.patchValue(updatedValue);
        activityImage.markAsDirty();
        activityImage.updateValueAndValidity();
      }      
    }
    this.activityFileInput.nativeElement.value = '';
  }


  removeImage(
    routeIndex: number, 
    dayIndex: number, 
    activityIndex: number, 
    imageIndex: number
  ) {
    const imagesArray = this.getItineraryImages(routeIndex, dayIndex, activityIndex);
    console.log(imagesArray);
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
        if(imagesArray.at(imageIndex).value.id){
          this.masterService.deleteActiivityImage(imagesArray.at(imageIndex).value.id).subscribe((resp:any)=>{
            this.toastr.success(resp.message);
            imagesArray.removeAt(imageIndex);
          });
        }        
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });    
  }

  removeImageActivity(routeIndex: number, 
    dayIndex: number, 
    activityIndex: number, 
    imageIndex: number)
  {
    const activityImage = this.getActivityImagesArray(routeIndex, dayIndex, activityIndex).at(imageIndex);
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
        activityImage.patchValue({
          preview: ''
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });
  
  }

  // Create image preview
  createImagePreview(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  addStay(routeIndex: number, dayIndex: number, trip_route:any, dayNumber:number) {    
    const stays = this.getStays(routeIndex, dayIndex);
    this.routeData = trip_route;
     // Close any open activity forms
      const activities = this.getActivities(routeIndex, dayIndex);
      activities.controls.forEach(control => {
        if (control.get('add_new')?.value) {
          control.patchValue({ add_new: false });
        }
      });

      // Close any open transfer forms
      const transfers = this.getTransfers(routeIndex, dayIndex);
      transfers.controls.forEach(control => {
        if (control.get('add_new')?.value) {
          control.patchValue({ add_new: false });
        }
      });
    const openForms = stays.controls.some(control => control.get('add_new')?.value);
    if(openForms){
      return;
    }
    const dayForm = this.getDayForm(routeIndex, dayIndex);
    //this.getRouteWiseHotels(trip_route.route.id);
    // Create the form group using FormBuilder
    const newStayForm = this._formBuilder.group({
      tour_package_id: this.packageId,
      trip_route_id: dayForm.get('trip_route_id')?.value,
      tour_itinerary_id: dayForm.get('id')?.value,
      room_id: [null, Validators.required],
      day_number: [dayNumber],
      stay_title: ['', Validators.required],
      check_in_time: [null, Validators.required],
      check_out_time: [null, Validators.required],
      no_of_night_stay: ['1', Validators.required],
      // Initialize boolean controls with FormControl      
      hotels: ['', Validators.required],
      meals: [''],
      is_breakfast: [false],
      is_lunch: [false],
      is_dinner: [false],
      is_dinner_or_lunch: [false],
      add_new: true,
      delete_id: ['']
    });

    stays.push(newStayForm);

}

  closeStay(routeIndex: number, dayIndex: number, stayIndex: number){
    const stays = this.getStays(routeIndex, dayIndex);
    stays.removeAt(stayIndex);
  }

  addTransfer(routeIndex: number, dayIndex: number, dayNumber:number) {
    const transfers = this.getTransfers(routeIndex, dayIndex);

    // Close any open activity forms
    const activities = this.getActivities(routeIndex, dayIndex);
    activities.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });

    // Close any open stay forms
    const stays = this.getStays(routeIndex, dayIndex);
    stays.controls.forEach(control => {
      if (control.get('add_new')?.value) {
        control.patchValue({ add_new: false });
      }
    });
    const openForms = transfers.controls.some(control => control.get('add_new')?.value);
    if(openForms){
      return;
    }
    const dayForm = this.getDayForm(routeIndex, dayIndex);
    const newTransfer = this._formBuilder.group({
      transfer_title: ['', Validators.required],
      tour_package_id: [this.packageId],
      trip_route_id: [dayForm.controls['trip_route_id'].value],
      tour_itinerary_id: [dayForm.controls['id'].value],
      day_number: [dayNumber],
      transfer_type: ['', Validators.required],
      vehicle_type: ['', Validators.required],
      pickup_location: ['', Validators.required],
      dropoff_location: ['', Validators.required],
      halts: this._formBuilder.array([]),
      add_new: true,
      delete_id:['']
    });

    transfers.push(newTransfer);
  }

  closeTransfer(routeIndex: number, dayIndex: number, transferIndex:number){
    const transfers = this.getTransfers(routeIndex, dayIndex);
    transfers.removeAt(transferIndex);
  }

  deleteActivity(activityId:string, routeIndex: number, dayIndex: number, transferIndex: number)
  {
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
          return  this.masterService.deleteTourItinerary(activityId).subscribe((resp:any)=>{
            if(resp.message){
              this.toastr.success(resp.message);
              this.removeActivity(routeIndex, dayIndex, transferIndex);
              this.getPackageDetails(this.packageId, false);
            }
          })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      });
   
  }

  deleteStay(stayId:string, routeIndex: number, dayIndex: number, transferIndex: number)
  {
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
        return this.masterService.deleteTourItinerary(stayId).subscribe((resp:any)=>{
          if(resp.message){
            this.toastr.success(resp.message);
            this.removeStay(routeIndex, dayIndex, transferIndex);
            this.getPackageDetails(this.packageId, false);
          }
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });
    
  }

  deleteTransfer(transferId:string, routeIndex: number, dayIndex: number, transferIndex: number)
  {
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
        return this.masterService.deleteTourItinerary(transferId).subscribe((resp:any)=>{
          if(resp.message){
            this.toastr.success(resp.message);
            this.removeTransfer(routeIndex, dayIndex, transferIndex);
            this.getPackageDetails(this.packageId, false);
          }
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });
    
  }

  // Remove methods
  removeActivity(routeIndex: number, dayIndex: number, activityIndex: number) {
    this.getActivities(routeIndex, dayIndex).removeAt(activityIndex);
  }

  removeStay(routeIndex: number, dayIndex: number, stayIndex: number) {
    this.getStays(routeIndex, dayIndex).removeAt(stayIndex);
  }

  removeTransfer(routeIndex: number, dayIndex: number, transferIndex: number) {
    this.getTransfers(routeIndex, dayIndex).removeAt(transferIndex);
  }

  // Save and edit methods
  saveTripDetails(trip_route:any, routeIndex: number, dayIndex: number, dayNumber:number) {
    this.btnSaving = true;
    const dayForm = this.getDayForm(routeIndex, dayIndex);
    if (dayForm.get('tripDetails')?.valid) {
      const id = dayForm.get('id')?.value;
      const formData = dayForm.get('tripDetails')?.value;
      this.masterService.addTourItinerary({
        ...(id && { id: id }),
        tour_package_id: this.packageId,
        trip_route_id: trip_route?.id,
        day_number: dayNumber,
        title: formData.title,
        description: formData.description,
        is_active: true,
      }).subscribe((resp:any)=>{
        this.btnSaving = false;
        if(resp.message){
          this.toastr.success(resp.message);
          this.tourItineraryId=resp.tour_itinerary_id;
          this.tripRouteId=resp.trip_route_id;
          dayForm.patchValue({ isSaved: true, id:resp.tour_itinerary_id, trip_route_id:resp.trip_route_id });
        }
      })      
    }
  }

  editTripDetails(routeIndex: number, dayIndex: number) {
    const dayForm = this.getDayForm(routeIndex, dayIndex);    
    this.getDayForm(routeIndex, dayIndex).patchValue({ id:dayForm.get('id')?.value, isSaved: false, isEdit: true });
  }

  closeTripDetailsForm(routeIndex: number, dayIndex: number)
  {
    this.getDayForm(routeIndex, dayIndex).patchValue({ isSaved: true, isEdit: false });
  }

  isActivityValid(routeIndex: number, dayIndex: number, activityIndex: number): boolean {
    const activity = this.getActivityForm(routeIndex, dayIndex, activityIndex);
    
    // Check if activity title exists and is not empty
    const hasTitle = activity.get('activityDetails.activity_title')?.value?.trim();
    
    // Check if at least one image is uploaded
    const hasImages = activity.get('images')?.value?.length > 0;
    
    // Check if at least one activity image with experience is added
    const activityImages = activity.get('activityImages')?.value;
    const hasActivityWithExperience = activityImages?.some((img: any) => 
      img.preview && img.experiences?.trim()
    );

    //return !!hasTitle && hasImages && hasActivityWithExperience;
    return !!hasTitle && hasImages;
  }

  isActivityImageValid(routeIndex: number, dayIndex: number, activityIndex: number): boolean {
    const activity = this.getActivityForm(routeIndex, dayIndex, activityIndex);
    
    // Check if at least one activity image with experience is added
    const activityImages = activity.get('activityImages')?.value;
    const hasActivityWithExperience = activityImages?.some((img: any) => 
      img.preview && img.experiences?.trim()
    );

    //return !!hasTitle && hasImages && hasActivityWithExperience;
    return !!hasActivityWithExperience;
  }

  saveActivity(routeIndex: number, dayIndex: number, activityIndex: number, dayNumber:number) {
    if (!this.isActivityValid(routeIndex, dayIndex, activityIndex)) {
      return;
    }
    this.btnSaving = true;
    const activityForm = this.getActivityForm(routeIndex, dayIndex, activityIndex);
    const activityData = activityForm.value; 
    let day = dayNumber;
    const formData = new FormData();
    activityData.id?formData.append('id', activityData.id):'';
    formData.append('tour_package_id', this.packageId);
    formData.append('trip_route_id', activityData.activityDetails.trip_route_id);
    formData.append('tour_itinerary_id', activityData.activityDetails.tour_itinerary_id);
    formData.append('activity_title', activityData.activityDetails.activity_title);
    formData.append('day_number', day.toString());
    // files.forEach((file, index) => {
    //   body.append('uploaded_files', file);
    // });    
    if (activityData.images && activityData.images.length > 0) {
      activityData.images.forEach((image: any) => {
        if (image.file) {
          formData.append('uploaded_files', image.file);
        }
      });
    }
    // if (activityData.activityImages && activityData.activityImages.length > 0) {
    //   const experiences: string[] = [];
    //   activityData.activityImages.forEach((activityImage: any) => {
    //     if (activityImage.experiences && activityImage.experience_files) {
    //       experiences.push(activityImage.experiences);
    //       formData.append('experience_files', activityImage.experience_files);
    //     }
    //   });
      
    //   // Append all experiences as a single array
    //   formData.append('experiences', JSON.stringify(experiences));
    // }
    
    this.masterService.addTourActivityData(formData).subscribe({
      next: (response:any) => {
        this.btnSaving = false;
        this.toastr.success(response.message);
        //this.resetTActivityForm(routeIndex, dayIndex);
        //activityForm.disable();
        activityForm.patchValue({
          id: response.data.id,
          activityDetails: {
            activity_title: response.data.activity_title,
          },
          add_new: true,
          delete_id: ''
        });
        if(activityData.id){

        }else{
          this.addActivityImage(routeIndex, dayIndex, activityIndex);
        }
        
      },
      error: (error) => {
        this.btnSaving = false;
        console.log(error.status);
        console.error('Error saving activity', error);
        // Show error message        
        //this.toastr.error('Error saving activity');
        if (error.status === 413) {
          this.toastr.error('File size too large. Please try a smaller file or contact administrator.');
        } else {
          this.toastr.error('Error saving activity');
        }
      }
    });

    // Optional: Disable form fields after saving
    

    // You can also add an edit mode feature
    // this.addEditButton(routeIndex, dayIndex, activityIndex);
    this.getPackageDetails(this.packageId, false);
  }

  getStayControl(routeIndex: number, dayIndex: number, stayIndex: number): AbstractControl {
    return this.getStays(routeIndex, dayIndex).at(stayIndex);
  }

  getTransferControl(routeIndex: number, dayIndex: number, stayIndex: number): AbstractControl {
    return this.getTransfers(routeIndex, dayIndex).at(stayIndex);
  }

  isStayValid(routeIndex: number, dayIndex: number, stayIndex: number): boolean {
      const stayControl = this.getStayControl(routeIndex, dayIndex, stayIndex);
      return stayControl.valid;
  }

  async saveStay(routeIndex: number, dayIndex: number, stayIndex: number) {
    this.btnSaving = true;
    const stayControl = this.getStayControl(routeIndex, dayIndex, stayIndex);
    if (stayControl.valid) {
        const stayData = stayControl.value;
        stayData.is_breakfast=false;
        stayData.is_lunch = false;
        stayData.is_dinner = false;
        stayData.is_dinner_or_lunch = false;
        if(stayData.meals.includes('is_breakfast')){
          stayData.is_breakfast = true;
        }
        if(stayData.meals.includes('is_lunch')){
          stayData.is_lunch = true;
        }
        if(stayData.meals.includes('is_dinner')){
          stayData.is_dinner = true;
        }
        if(stayData.meals.includes('is_dinner_or_lunch')){
          stayData.is_dinner_or_lunch = true;
        }
        //return;
        //stayData.check_in_time = this.formatTime(stayData.check_in_time);
        //stayData.check_out_time = this.formatTime(stayData.check_out_time);
        ///console.log(stayData);
        // Call your API service here
        this.masterService.addTourStay(stayData).subscribe({
            next: (response: any) => {
              this.btnSaving = false;
                this.toastr.success('Stay details saved successfully!');
                //this.resetStayForm(routeIndex, dayIndex);
                stayControl.patchValue({add_new:false});
                this.getPackageDetails(this.packageId, false);
            },
            error: (error) => {
              this.btnSaving = false;
                this.toastr.error('Error saving stay details');
            }
        });
    } else {
      this.btnSaving = false;
        this.toastr.error('Please fill all required fields');       
    }
}

formatTime(dateString: string): string {
  return this.datePipe.transform(dateString, 'hh:mm a') || '';
}

  async saveTransfers(routeIndex: number, dayIndex: number, transferIndex:number, dayNumber:number) {
    this.btnSaving = true;
    const transferControl = this.getTransferControl(routeIndex, dayIndex, transferIndex);
    try {
      if (this.isFormValid(routeIndex, dayIndex)) {
        //this.isSubmitting = true;
        const transfers = this.getTransfers(routeIndex, dayIndex).value;        
        // Transform the data if needed before sending to API
        const transformedData = transfers.map((transfer:any) => ({
          ...transfer,
          halts: transfer.halts.map((halt:any) => ({
            ...halt,
            // Add any additional transformations needed
          }))
        }));

        const response = await this.masterService.addTourTransfer(transformedData[transferIndex]).toPromise();
        this.getPackageDetails(this.packageId, false);
        this.btnSaving = false;
       this.toastr.success('Transfers saved successfully!');
       transferControl.patchValue({add_new:false});

        // Optionally reset or update the form after successful save
        // this.resetTransferForm(routeIndex, dayIndex);
      } else {
        this.btnSaving = false;
        this.markFormGroupTouched(this.getTransfers(routeIndex, dayIndex));
        this.toastr.error('Please fill in all required fields.');
      }
    } catch (error) {
      this.btnSaving = false;
      console.error('Error saving transfers:', error);
      this.toastr.error('Error saving transfers. Please try again.');     
    } finally {
      this.btnSaving = false;
      //this.isSubmitting = false;
      //this.resetTransferForm(routeIndex, dayIndex);
      
    }
  }

  isFormValid(routeIndex: number, dayIndex: number): boolean {
    const transfers = this.getTransfers(routeIndex, dayIndex);
    return transfers.valid;
  }

  private markFormGroupTouched(formGroup: any) {
    Object.values(formGroup.controls).forEach((control:any) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  // Reset transfer form
  resetTransferForm(routeIndex: number, dayIndex: number) {
    const transfers = this.getTransfers(routeIndex, dayIndex);
    transfers.clear();
    transfers.push(this.createTransferFormGroup());
  }

  onSubmit() {
    if (this.tripForms.valid) {
      console.log(this.tripForms.value);
      // Add your API call here
    }
  }

  // editDestinationRoute(tripRoutes: any)
  // {
  //   this.showAddRouteForm=true;
  //   this.createDestinationForm();
  //   this.routeDestinationForm.patchValue({
  //     id: tripRoutes.id,
  //     tour_package_id: this.packageId,
  //     route_id: tripRoutes.route.id,
  //     no_of_days_stay: tripRoutes.no_of_days_stay
  //   })
  //   this.generateDayPanels(tripRoutes.no_of_days_stay);
  // }

  editDestinationRoute(tripRoute:any, routeIndex:number) {
    const route = tripRoute;
    
    // Create dialog configuration
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: 'Edit Destination Route',
      routeData: tripRoute,
      routeList: this.routeList,
      packageId: this.packageId,
      dayCount: this.dayCount,
      tripDuration: this.tripDuration
    };

    // Open dialog
    const dialogRef = this.dialog.open(EditDestinationRouteComponent, dialogConfig);

    // Handle dialog close
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result==1) {
        this.getPackageDetails(this.packageId, false);
        this.toastr.success('Route updated successfully!');
        // Update the route data
        //this.tripRoutes[routeIndex] = result;
        
        // Update the form control value
        // const routesFormArray = this.tripForms.get('routes') as FormArray;
        // routesFormArray.at(routeIndex).patchValue({
        //   route_id: result.route.id,
        //   no_of_days_stay: result.no_of_days_stay
        // });

        // Refresh the days array for this route
        //this.updateDaysArray(routeIndex, result.no_of_days_stay);
      }
    });
  }

  deleteDestinationRoute(tripRoute:any)
  {
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
          if(tripRoute?.id){
            // this.masterService.deleteRouteImage(preview.id).subscribe((resp:any)=>{
              
            // });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      });
  }

  updateDaysArray(routeIndex: number, no_of_days_stay: any) {
    throw new Error('Method not implemented.');
  }

  cancelDestinationRoute()
  {
    this.showAddRouteForm=false;
    this.routeDestinationForm.reset();
  }

  addDestinationForm()
  {
    // this.showAddRouteForm=true;
    // this.createDestinationForm();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: 'Add Destination Route',
      routeList: this.routeList,
      packageId: this.packageId,
      dayCount: this.dayCount,
      tripDuration: this.tripDuration
    };

    const dialogRef = this.dialog.open(EditDestinationRouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result==1) {
        this.getPackageDetails(this.packageId, false);
        this.toastr.success('Route updated successfully!');
        // Update the route data
        //this.tripRoutes[routeIndex] = result;
        
        // Update the form control value
        // const routesFormArray = this.tripForms.get('routes') as FormArray;
        // routesFormArray.at(routeIndex).patchValue({
        //   route_id: result.route.id,
        //   no_of_days_stay: result.no_of_days_stay
        // });

        // Refresh the days array for this route
        //this.updateDaysArray(routeIndex, result.no_of_days_stay);
      }
    });
  }

  createDestinationForm()
  {
    // this.routeDestinationForm = this._formBuilder.group({
    //   tour_package_id: [''],
    //   route_id: ['', Validators.required],
    //   no_of_days_stay: ['', Validators.required]
    // });
    this.routeDestinationForm = this._formBuilder.group({
      id:[''],
      tour_package_id: [''],
      route_id: ['', Validators.required],
      no_of_days_stay: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      dayDetails: this._formBuilder.array([])
    });
  }

  // generateArray(length: number): number[] {
  //   return Array.from({ length }, (_, index) => index + 1);
  // }
  generateArray(length: number, routeIndex: number): number[] {
    // Calculate the starting day for this route
    if (routeIndex === 0) {
      this.routeStartDays[routeIndex] = 1;
    } else {
      // Get the previous route's start day and length
      const previousRouteStart = this.routeStartDays[routeIndex - 1];
      const previousRouteLength = this.tripRoutes[routeIndex - 1].no_of_days_stay;
      this.routeStartDays[routeIndex] = previousRouteStart + previousRouteLength;
    }
  
    // Generate array with continuous day numbers
    return Array.from({ length }, (_, index) => {
      return this.routeStartDays[routeIndex] + index;
    });
  }

  generateDayPanels(days: number) {
    const dayDetailsArray = this.routeDestinationForm.get('dayDetails') as FormArray;
    
    // Clear existing day details
    dayDetailsArray.clear();

    // Generate new day details form groups
    for (let i = 1; i <= days; i++) {
      dayDetailsArray.push(this.createDayDetailFormGroup(i));
    }
  }

  createDayDetailFormGroup(dayNumber: number): FormGroup {
    return this._formBuilder.group({
      id:[''],
      tour_package_id: [this.packageId],
      day_number: [dayNumber],
      trip_route_id: [this.tripRoutes?.id],
      title: [''],
      description: ['']
    });
  }

  createSetPriceForm()
  {
    this.setPriceForm = this._formBuilder.group({
      tour_package_id: [''],
      room_id: ['', [Validators.required]],
      price: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      offer_price: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
        this.offerPriceValidator()
      ]]
    });
  }

  editPriceDetails(trip_price:any)
  {
    this.setPriceForm = this._formBuilder.group({
      id: [trip_price.id],
      tour_package_id: [''],
      room_id: [trip_price.room?.id, [Validators.required]],
      price: [trip_price.price, [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]],
      offer_price: [trip_price.offer_price, [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
        this.offerPriceValidator()
      ]]
    });
  }

  private offerPriceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const price = control.parent.get('price')?.value;
      const offerPrice = control.value;
      
      if (!price || !offerPrice) {
        return null;
      }
  
      return parseFloat(offerPrice) >= parseFloat(price) 
        ? { invalidOfferPrice: true } 
        : null;
    };
  }

  basicInfoSubmit() {      
    
    let facilities = this.basicInfoForm.value.facilities_json;
    let facilitiesJson = facilities.map((item: any) => 
      this.facilities.find(facility => facility.value === item)
    );

    if(!this.basicInfoForm.valid){
      this.markFormGroupTouched(this.basicInfoForm);
      this.toastr.error('Please check the all required fields.');
      return;
    }
    
    if (this.basicInfoForm.valid) {      
      //const duration = this.durations.filter((duration: any) => duration.id === this.basicInfoForm.getRawValue().trip_duration_id); 
      this.basicInfoForm.value.number_of_days = this.basicInfoForm.getRawValue()?.number_of_days;
      if(this.basicInfoForm.getRawValue()?.number_of_days){
        //this.basicInfoForm.value.number_of_days = duration[0].no_of_days;      
        this.basicInfoForm.value.number_of_nights = parseInt(this.basicInfoForm.value.number_of_days)-1;
      }else{
        this.toastr.error('Select duration form the list.');
        return;
      }
      this.basicInfoSaving = true;
      this.basicInfoForm.value.destination_ids = this.basicInfoForm.getRawValue()?.destination_ids;
      let group_tour_dates = this.basicInfoForm.getRawValue()?.grouptour_dates_json;        
      const formattedDates = group_tour_dates.map((date: any) => {
        return this.datePipe.transform(date?.tour_date, 'yyyy-MM-dd');
      }).filter((date:any) => date !== null && date !== undefined);
      let inclusionArr = this.basicInfoForm.value.inclusions;
      const cancelationPolicy = this.basicInfoForm.getRawValue()?.cancelation_policies.map((policy:any)=>({
        id: policy?.id,
        min_days: policy?.min_days,
        max_days: policy?.max_days,
        percentage: policy?.percentage,
        policy: policy?.policy || `${policy?.min_days} days before ${policy?.percentage}% refund` 
      }))
      //const uniqueFilteredArray = [...new Set(inclusionArr.filter((item:string) => item !== ""))];
     //** */ this.basicInfoForm.value.destination_ids = this.basicInfoForm.getRawValue()?.destination_ids;
      //this.basicInfoForm.value.trip_duration_id = this.basicInfoForm.getRawValue()?.trip_duration_id;
      this.basicInfoForm.value.grouptour_dates_json = formattedDates;
      this.basicInfoForm.value.cancelation_policies = cancelationPolicy;
      this.basicInfoForm.value.inclusions = this.transformArray(inclusionArr);
      let exclusionsArr = this.basicInfoForm.value.exclusions;
      const uniqueExclusionsArray = [...new Set(exclusionsArr.filter((item:string) => item !== ""))];
      this.basicInfoForm.value.exclusions = this.transformArray(exclusionsArr);
      // this.basicInfoForm.value.meta_tags = this.chips.toString();
      this.basicInfoForm.value.facilities_json = facilitiesJson;
      this.masterService.addTourBasicInfo(this.basicInfoForm.value).subscribe({
        next: (res: any) => {
          this.basicInfoSaving = false;
          if(res.tour_package_id){
            this.toastr.success(res.message);
            this.getPackageDetails(res.data?.id, false);
            if(!this.packageId){
              this.basicInfoForm.reset();
              //this.router.navigateByUrl('trip-packages/add?package_id='+res.data?.id);
              window.location.href='trip-packages/add?package_id='+res.data?.id;
            }else{
              this.stepper.next();
            }
            
          }
        },
        error: (err: any) => {
          this.basicInfoSaving = false;
          this.toastr.error(err.error.detail);
        }
      });
    }
  }

  packageImageUpload()
  {
    if(this.packageSelectedFiles.length==0){
      this.toastr.error('Please select at least one image');
      return;
    }
    this.packageImgUploading=true;
    this.masterService.addTourPackageImage(this.packageId, this.packageSelectedFiles).subscribe({
      next: (res: any) => {
        if(res.message){
          this.toastr.success(res.message);
          this.packageImgUploading=false;
          this.packageSelectedFiles = [];
          this.getPackageDetails(this.packageId, false);
          this.stepper.next();
        }
      },
      error: (err: any) => {
        this.packageImgUploading=false;
        this.toastr.error(err.error.detail);
      }
    })
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
          this.masterService.updateTourImageAlt({'image_id':preview.id, 'image_alt':result.value}).subscribe((resp)=>{
            const imageIndex = this.packageImagePreviews.findIndex((img:any) => img.id === preview.id);
            if (imageIndex !== -1) {
              this.packageImagePreviews[imageIndex] = {
                ...this.packageImagePreviews[imageIndex],
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

    transformArrayDate(data: any[]): any[] {
      // If data is undefined, null, or not an array, return an empty array
      if (!data || !Array.isArray(data)) return [];
      
      // If the array is empty, return it as is
      if (data.length === 0) return data;
      
      // Process the array based on its structure
      return data.map(item => {
        // If it's a simple date string
        if (typeof item === 'string') {
          return item.trim();
        }
        
        // If it's a Date object
        if (item instanceof Date) {
          // Use date methods to avoid timezone issues
          return `${item.getFullYear()}-${String(item.getMonth() + 1).padStart(2, '0')}-${String(item.getDate()).padStart(2, '0')}`;
        }
        
        // If it's an object with tour_date property (from your data)
        if (item && typeof item === 'object' && item.tour_date) {
          // Parse the date and preserve the correct day
          const date = new Date(item.tour_date);
          // Use UTC methods to avoid timezone issues
          return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
        }
        
        // If it's an object with text property (from tag inputs)
        if (item && typeof item === 'object' && item.text) {
          return item.id === null 
            ? item.text.trim() 
            : `${item.id}^^^^^^^^${item.text.trim()}`;
        }
        
        // If we can't determine the format, return empty string
        return '';
      }).filter(Boolean); // Remove any empty strings
    }

  transformArray(data: Array<{id: number | null, text: string}>): string[] {
    if (!Array.isArray(data)) return [];
    
    return data
      .filter(item => item?.text?.trim() !== '') // Remove items with blank text
      .map(item => {
        if (!item || typeof item.text !== 'string') return '';
        
        return item.id === null 
          ? item.text.trim() 
          : `${item.id}^^^^^^^^${item.text.trim()}`;          
      })
      .filter(item => item !== ''); // Remove any empty strings
  }

  routeDestinationSubmit()
  {
    const totalDay = this.dayCount+this.routeDestinationForm.value.no_of_days_stay;
    if(totalDay>this.tripDuration){
      this.toastr.error('Trip Duration should be less than or equal to '+(this.tripDuration-this.dayCount));
      return;
    }

    if(this.routeDestinationForm.valid)
    {
      this.destinationRouteSave = true;
      this.routeDestinationForm.patchValue({
        tour_package_id: this.packageId
      });
      this.masterService.addTourDestination(this.routeDestinationForm.value).subscribe({
        next: (res: any) => {
          this.destinationRouteSave = false;
          if(res.tour_package_id){
            this.dayCount += res.data?.no_of_days_stay;
            this.toastr.success(res.message);
            //this.stepper.next();
            this.showAddRouteForm=false;
            this.tripRoutes.push(res.data);           
            // this.tripRoutes.forEach((route: any) => {
            //   const routeFormArray = this.getRoutes();
            //   routeFormArray.push(this.createRouteForm(route.no_of_days_stay));
            //   const routeIndex = 0; // Set this based on your logic
            //   this.setTripData(route, routeIndex);              
            // });
            this.getPackageDetails(this.packageId, false);
          }
        },
        error: (err: any) => {
          this.destinationRouteSave = false;
          this.toastr.error(err.error.detail);
        }
      });
    }
  }

  sePriceFormSubmit()
  {
    this.toastr.success('Price updated suceessfully!');
    return;
    if(this.setPriceForm.valid)
    {
      this.btnSaving = true;
      this.setPriceForm.patchValue({
        tour_package_id: this.packageId
      });
      this.masterService.setPriceInfo(this.setPriceForm.value).subscribe({
        next: (res: any) => {
          if(res.data.id){
            this.toastr.success(res.message);
            this.btnSaving = false;
            this.getPackageDetails(this.packageId, false);
            this.setPriceForm.reset();
            //this.stepper.next();
            //this.router.navigateByUrl('/trip-packages');
          }
        },
        error: (err: any) => {
          this.btnSaving = false;
          this.toastr.error(err.error.detail);
        }
      });
    }
  }

  goBackListing(){
    this.router.navigateByUrl('/trip-packages');
  }

  private initializeFormGroups(): void {
    this.HFormGroup2 = this._formBuilder.group({
      address: ['', Validators.required],
    });

    this.VFormGroup1 = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.VFormGroup2 = this._formBuilder.group({
      address: ['', Validators.required],
    });

    
  }

  onFacilityChange(event: { value: string }): void {
    if (this.selectedFacilities.has(event.value)) {
      this.selectedFacilities.delete(event.value);
    } else {
      this.selectedFacilities.add(event.value);
    }
  }

  filterByRoomId(data: any[], roomId: string): any[] {
    return data.filter(item => item.room.id === roomId);
  }

  onRoomSelect(roomId: string) {
    this.selectedRoomPrices = this.filterByRoomId(this.tripPrices, roomId);
  }

  getRoompriceData(roomId: string, num_of_person:number)
  {
    return this.tripPrices.find((price:any) => 
      price.room.id === roomId && price.no_of_person === num_of_person
    ) || {
      price: 0,
      offer_price: 0,
      extra_adult_price: 0,
      no_of_person: num_of_person,
      room_id: roomId
    };
  }

  updatePrice(priceData:any) {
    console.log(priceData);
    const {id, price, offer_price, extra_adult_price} =  priceData;
    this.masterService.updateTripRoomPrice({ 'tour_package_id':this.packageId,'id':id, 'price':price, 'offer_price':offer_price, 'extra_adult_price':extra_adult_price}).subscribe({
      next: (res: any) => {
        
      },
      error: (err: any) => {
        this.toastr.error(err.error.detail);
      }
    });
  }

  organizeDataByPersonCount(roomId: string) {
    // Initialize prices for all person counts
    this.personCounts.forEach(count => {
      const existingPrice = this.tripPrices.find((price:any) => 
        price.room.id === roomId && price.no_of_person === count
      ) || {
        price: 0,
        offer_price: 0,
        extra_adult_price: 0,
        no_of_person: count,
        room_id: roomId
      };

      this.roomPrices[count] = existingPrice;
    });
  }

//

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

// ngOnInit(): void {
//   this.editor = new Editor();
// }

// make sure to destory the editor
ngOnDestroy(): void {
  this.editor?.destroy();
}

}

interface FileValidationResult {
  isValid: boolean;
  message?: string;
}

// interface DaySection {
//   type: 'activity' | 'stay' | 'transfer';
//   data: any;
//   order?: number;
// }