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
  stayCategory: any = [];
  isLoading: boolean = false;
  payabelAmt: number = 0;
  minPayAmt: number = 0;
  dialogType: string = 'create';  
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchCtrl = new FormControl('');
  private _onDestroy = new Subject<void>();
  public countryCodeService = inject(CountryCodeService);
  public filtered:any = [];
  public flag = 'https://flagcdn.com/w320/in.png';
  minDate: Date = new Date();
  editor?: Editor;
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
      this.dialogTitle = 'Modify Query Lead';
      //this.getPackageByDestination(this.quotation?.tour_package?.destination_list?.[0]?.destination?.id);
    }
    this.quotationForm = this.createQuotationForm();
    this.minPayAmt = (data.quotation?.offer_price*30/100);
    this.filtered = this.countryCodeService?.codes;

    this.filteredDestinations$.next(this.destinations);
    this.editor = new Editor();
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
      price_id: [''],
      offer_price: ['', [Validators.required]],
      full_name: [this.quotation?.full_name, [Validators.required]],
      country_code: [this.quotation?.country_code || '+91', [Validators.required]],
      mobile_no: [this.quotation?.mobile_no, [Validators.required]],
      email: [this.quotation?.email, [Validators.required, Validators.email]],
      travel_start_date: [this.quotation?.travel_start_date, [Validators.required]],
      traveler_count: [this.quotation?.traveler_count || 1],
      traveler_no_of_adult: [this.quotation?.traveler_no_of_adult || 1],
      traveler_no_of_child: [this.quotation?.traveler_no_of_child || 0],
      traveler_no_of_infant: [this.quotation?.traveler_no_of_infant || 0],
      aditional_requirement: [''],
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
      this.dialogRef.close(1);
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
    this.masterService.getPackageByPrice(formData).subscribe((resp:any)=>{
      this.quotationForm.patchValue({
        price_id: resp.data?.id,
        offer_price: resp.data?.offer_price,
        traveler_count: total_travelers
      });
      this.payabelAmt = resp.data?.offer_price;
    });
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.editor?.destroy();
  }
}
