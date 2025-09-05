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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
    selector: 'app-create-quotation-dialog',
    templateUrl: './create-quotation-dialog.component.html',
    styleUrls: ['./create-quotation-dialog.component.scss'],
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
        NgxMatSelectSearchModule,
        MatRadioModule,
        AsyncPipe,
        CommonModule,
        MatDatepickerModule,
        NgxEditorModule
    ],
})
export class CreateQuotationDialogComponent {  
  dialogTitle: string = 'Create Quotation';
  quotationForm: UntypedFormGroup;
  quotation: any;
  destinations: any;
  packageLists: any = [];
  selectedPackage: any = {};
  priceData: any = {};
  packageWithPrice: any = {};
  stayCategory: any = [];
  isLoading: boolean = false;
  payabelAmt: number = 0;
  minPayAmt: number = 0;
  totalAmt: number = 0;
  dialogType: string = 'create';  
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchCtrl = new FormControl('');
  private _onDestroy = new Subject<void>();
  public countryCodeService = inject(CountryCodeService);
  public filtered:any = [];
  public flag = 'https://flagcdn.com/w320/in.png';
  minDate: Date = new Date();
  editor?: Editor;
  editor2?: Editor;
  editor3: Editor;
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

  constructor(
    public dialogRef: MatDialogRef<CreateQuotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    public datePipe: DatePipe
  ) { 
    this.quotation = data.quotation;
    this.destinations = data.destinations;
    this.dialogType = data.action;
    if(data.action=='edit'){
      this.dialogTitle = 'Modify Package';      
      this.getPackageByDestination(this.quotation?.tour_package?.destination_list?.[0]?.destination?.id);
    }
    this.editor = new Editor();
    this.editor2 = new Editor();
    this.editor3 = new Editor();
    this.quotationForm = this.createQuotationForm();
    this.minPayAmt = (data.quotation?.offer_price*30/100);
    this.filtered = this.countryCodeService?.codes;

    this.filteredDestinations$.next(this.destinations);
    this.quotationForm = this.createQuotationForm();
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

  createQuotationForm(): UntypedFormGroup {    
    return this.fb.group({    
      destination_id: [this.quotation?.tour_package?.destination_list?.[0]?.destination?.id, [Validators.required]],
      tour_package_id: [this.quotation?.tour_package?.id, [Validators.required]],
      stay_category_id: [this.quotation?.room?.id, [Validators.required]],
      stay_category: [this.quotation?.room?.name],
      price_id: [''],
      package_price: ['', [Validators.required]],
      quotation_price:['', [Validators.required]],
      full_name: [this.quotation?.full_name, [Validators.required]],
      country_code: [this.quotation?.country_code || '+91', [Validators.required]],
      mobile_no: [this.quotation?.mobile_no, [Validators.required]],
      email: [this.quotation?.email || ''],
      travel_start_date: [this.quotation?.travel_start_date, [Validators.required]],
      traveler_count: [this.quotation?.traveler_count || 1],
      traveler_no_of_adult: [this.quotation?.traveler_no_of_adult || 1],
      traveler_no_of_child: [this.quotation?.traveler_no_of_child || 0],
      traveler_no_of_infant: [this.quotation?.traveler_no_of_infant || 0],
      aditional_requirement: [this.quotation?.aditional_requirement || ''],
      itenaries_str: [''],
      inclusion_exclusion_str: [''],
      no_of_rooms: [0],
      booking_type: ['quotation'],
      destination_name:['', Validators.required],
      destination_routes: ['', Validators.required],
      tour_package_name: ['', Validators.required],
      tour_package_type: ['', Validators.required],
      trip_duration: ['', Validators.required],
      filter: ['']
    });
  }
  
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmUpdate(): void {
    this.isLoading=true;
    if(this.quotationForm.invalid){
      this.isLoading=false;
      return;
    }
    this.quotationForm.value.travel_start_date = this.datePipe.transform(this.quotationForm.value.travel_start_date, 'yyyy-MM-dd');
    this.masterService.sendQuotation(this.quotationForm.value).subscribe((resp)=>{
      this.isLoading=false;
      this.dialogRef.close(resp);
    }
    ,(err)=>{
      this.isLoading=false;
      this.toastr.error(err?.err?.detail || 'Unable to send quotation');
    }
  )
    
  }

  getPackageByDestination(selectedId:string)
  {    
    this.masterService.getPackageByDestination(selectedId).subscribe((resp:any)=>{
      this.packageLists = resp.data;
      if(this.quotation?.tour_package?.id){
        this.stayCategory = this.packageLists[0]?.tour_selected_rooms;
        this.getPackagePrice();
      }
    });
  }

  getStayCategoryByPackage(selPackage: any)
  {
    this.selectedPackage = selPackage;
    this.stayCategory = selPackage?.tour_selected_rooms;
  }

  getPackagePrice()
  {    
    const total_travelers = parseInt(this.quotationForm.value.traveler_no_of_adult)+parseInt(this.quotationForm.value.traveler_no_of_child);
    const formData = {
      tour_package_id: this.quotationForm.value.tour_package_id,
      stay_category_id: this.quotationForm.value.stay_category_id,
      no_of_travelers: total_travelers
    }    
    // this.masterService.getPackageByPrice(formData).subscribe((resp:any)=>{
    //   this.priceData = resp?.data;
    //   this.calculatePrice();
    //   // this.quotationForm.patchValue({
    //   //   price_id: resp.data?.id,
    //   //   offer_price: resp.data?.offer_price,
    //   //   traveler_count: total_travelers
    //   // });
    //   //this.payabelAmt = resp.data?.offer_price;
    // });
    this.masterService.getPackageWithPrice(formData).subscribe((resp:any)=>{
      this.priceData = resp?.price_data;
      this.packageWithPrice = resp?.data;
      setTimeout(() => {
        this.calculatePrice();
        this.quotationForm.patchValue({          
          price_id: resp.price_data?.id,
          offer_price: resp.price_data?.offer_price,
          traveler_count: total_travelers,
          itenaries_str: resp?.data?.itenaries_html,
          inclusion_exclusion_str: resp?.data?.incl_excl_html,
          destination_name: resp.data?.destination_names,
          destination_routes: resp.data?.route_names,
          tour_package_name: resp.data?.packgae_name,
          tour_package_type: resp.data?.package_type,
          trip_duration: resp.data?.trip_duration,     
          stay_category: resp?.price_data?.room?.name     
        });
      }, 100);
    })
  }

  calculatePrice()
  {    
    const total_travelers = parseInt(this.quotationForm.value.traveler_no_of_adult)+parseInt(this.quotationForm.value.traveler_no_of_child);
    let per_person_offer = this.priceData?.offer_price || 0;
    let per_person_base = this.priceData?.price || 0;
    if (!this.priceData) {
      console.error('Price data is undefined');
      return;
    }

    if(this.selectedPackage?.package_type=='Group Tour'){
      per_person_offer = (parseFloat(this.priceData?.offer_price)*total_travelers);
      per_person_base = (parseFloat(this.priceData?.price)*total_travelers);
      this.totalAmt = parseInt(per_person_offer);
      this.minPayAmt = (parseInt(per_person_offer)*30/100);
    }
    else{
      if(total_travelers>2){
        if(!this.isEven(total_travelers)){
          this.priceData.offer_price = parseFloat(this.priceData?.offer_price)+parseFloat(this.priceData?.extra_adult_price);
          this.priceData.price = parseFloat(this.priceData?.price)+parseFloat(this.priceData?.extra_adult_price);
        }
        per_person_offer = (parseFloat(this.priceData?.offer_price)/total_travelers);
        per_person_base = (parseFloat(this.priceData?.price)/total_travelers);
      }else{
        per_person_offer = (parseFloat(this.priceData?.offer_price)/total_travelers);
        per_person_base = (parseFloat(this.priceData?.price)/total_travelers);
      }
      this.priceData.is_extra = (total_travelers>2 && !this.isEven(total_travelers));
      this.totalAmt = this.priceData?.offer_price;
      this.minPayAmt = (this.priceData?.offer_price*30/100);
    }
    
    if(this.priceData){
      this.priceData.per_person_offer = parseInt(per_person_offer);
      this.priceData.per_person_base = parseInt(per_person_base);
      this.quotationForm.patchValue({
        price_id: this.priceData?.id,
        package_price: this.priceData.offer_price,
        quotation_price: this.priceData.offer_price,
        traveler_count: total_travelers
      });
    }
  
  }

  isEven(number: number): boolean {
    return number % 2 === 0;
  }

  filter(evt:any) {
    this.filtered = this.countryCodeService?.codes.filter(option => 
      option.country.toLowerCase().includes(this.quotationForm.value.filter.toLowerCase()) ||
      option.code.toLowerCase().includes(this.quotationForm.value.filter.toLowerCase())
    );
  }

  clearFilter() {    
    this.quotationForm.get('filter')?.setValue('');
    this.filtered = this.countryCodeService?.codes; // Reset to original list
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
