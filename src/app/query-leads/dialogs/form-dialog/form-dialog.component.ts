import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

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
        NgxEditorModule
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  quotationForm: UntypedFormGroup;
  quotation: any;
  isLoading: boolean = false;
  editor?: Editor;
  editor2?: Editor;
  editor3?: Editor;
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
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Modify Query Leads';
      this.quotation = data.quotation;
    } else {
      this.dialogTitle = 'Quotation';
      // const blankObject = {} as Destination;
      // this.destination = new Destination(blankObject);
    }
    this.editor = new Editor();
    this.editor2 = new Editor();
    this.editor3 = new Editor();
    this.quotationForm = this.createQuotationForm();
    
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
  createQuotationForm(): UntypedFormGroup {
    return this.fb.group({      
      offer_price: [this.quotation.offer_price, [Validators.required]],
      quotation_price: [this.quotation.offer_price, [Validators.required]],
      full_name: [this.quotation.full_name, [Validators.required]],
      mobile_no: [this.quotation.mobile_no, [Validators.required]],
      email: [this.quotation.email, [Validators.required, Validators.email]],
      travel_start_date: [this.quotation.travel_start_date, [Validators.required]],
      traveler_count: [this.quotation.traveler_count],
      traveler_no_of_adult: [this.quotation.traveler_no_of_adult],
      traveler_no_of_child: [this.quotation.traveler_no_of_child],
      traveler_no_of_infant: [this.quotation.traveler_no_of_infant],
      aditional_requirement: [this.quotation.aditional_requirement||''],
      itenaries_str: [this.quotation.itenaries_str],
      inclusion_exclusion_str: [this.quotation.inclusion_exclusion_str],
      no_of_rooms:[this.quotation.no_of_rooms]
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
    let formData = {
      offer_price: this.quotationForm.value.offer_price,
      quotation_price: this.quotationForm.value.quotation_price,
      full_name: this.quotationForm.value.full_name,
      email: this.quotationForm.value.email,
      mobile_no: this.quotationForm.value.mobile_no,
      travel_start_date: this.quotationForm.value.travel_start_date,
      traveler_count: (parseInt(this.quotationForm.value.traveler_no_of_adult)+parseInt(this.quotationForm.value.traveler_no_of_child)+parseInt(this.quotationForm.value.traveler_no_of_infant)),
      traveler_no_of_adult: this.quotationForm.value.traveler_no_of_adult,
      traveler_no_of_child: this.quotationForm.value.traveler_no_of_child,
      traveler_no_of_infant: this.quotationForm.value.traveler_no_of_infant,
      aditional_requirement: this.quotationForm.value.aditional_requirement,
      itenaries_str: this.quotationForm.value.itenaries_str,
      inclusion_exclusion_str: this.quotationForm.value.inclusion_exclusion_str,
      no_of_rooms: this.quotationForm.value.no_of_rooms
    }
    this.masterService.updateQuerylead(formData, this.quotation.id).subscribe((resp:any)=>{
      if(resp.message){
        this.isLoading=false;
        this.dialogRef.close(1);
      }
    }),
    (error:any) => {
      this.isLoading=false;
      this.dialogRef.close(error);
    };
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editor2?.destroy();
    this.editor3?.destroy();
  }
}
