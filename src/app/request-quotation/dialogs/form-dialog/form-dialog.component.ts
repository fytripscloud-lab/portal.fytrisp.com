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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { DatePipe } from '@angular/common';

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
        NgxEditorModule,
        MatDatepickerModule,
        NgxMatTimepickerModule
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  quotationForm: UntypedFormGroup;
  quotation: any;
  isLoading: boolean = false;
  editor?: Editor;
  editor2: Editor;
  editor3: Editor;
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
    private fb: UntypedFormBuilder,
    public datePipe: DatePipe
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Modify Quotation';
      this.quotation = data.quotation;
    } else {
      this.dialogTitle = 'Quotation';
      // const blankObject = {} as Destination;
      // this.destination = new Destination(blankObject);
    }
    if(this.action=='callback')
    {
      this.quotation = data.quotation;
      this.dialogTitle = 'Quotation Call Back';
      this.quotationForm = this.creatCallBackForm();
    }else{
      this.quotationForm = this.createQuotationForm();
    }
    this.editor = new Editor();
    this.editor2 = new Editor();
    this.editor3 = new Editor();    
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
      full_name: [this.quotation.full_name, [Validators.required]],
      mobile_no: [this.quotation.mobile_no, [Validators.required]],
      email: [this.quotation.email, [Validators.required, Validators.email]],
      travel_start_date: [this.quotation.travel_start_date, [Validators.required]],
      traveler_count: [this.quotation.traveler_count],
      traveler_no_of_adult: [this.quotation.traveler_no_of_adult],
      traveler_no_of_child: [this.quotation.traveler_no_of_child],
      traveler_no_of_infant: [this.quotation.traveler_no_of_infant],
      aditional_requirement: [this.quotation.aditional_requirement||''],
      itenaries_str:[this.quotation?.itenaries_str || ''],
      inclusion_exclusion_str:[this.quotation?.inclusion_exclusion_str || ''],
    });
  }

  creatCallBackForm(): UntypedFormGroup {
    return this.fb.group({
      quotation_id: [this.quotation?.id, [Validators.required]],
      remark: ['', [Validators.required]],
      call_back_date: ['', [Validators.required]],
      call_back_time: ['', [Validators.required]],      
    });
  }

  
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  public confirmUpdate(): void {
    this.isLoading=true;

    if(this.action=='callback')
    {
      const dateMillis = this.quotationForm.value.call_back_date; // 17428783383
      const timeStr = this.quotationForm.value.call_back_time;    // '12:15 AM'
      let call_back_date = '';
      if (dateMillis && timeStr) {
        const dateObj = new Date(Number(dateMillis));

        // Extract and format the date part
        const year = dateObj.getFullYear();
        const month = this.pad(dateObj.getMonth() + 1);
        const day = this.pad(dateObj.getDate());

        // Convert 12-hour time string to 24-hour
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
          hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
          hours = 0;
        }

        const formattedTime = `${this.pad(hours)}:${this.pad(minutes)}:00`;
        call_back_date = `${year}-${month}-${day} ${formattedTime}`;
      }
      
      let formData = {
        quotation_id: this.quotationForm.value.quotation_id,
        remark: this.quotationForm.value.remark,
        call_back_date: call_back_date
      }      
      this.masterService.quotationCallback(formData).subscribe((resp:any)=>{
        if(resp.message){
          this.isLoading=false;
          this.dialogRef.close(1);
        }
      });
    }else{
      let formData = {
        offer_price: this.quotationForm.value.offer_price,
        full_name: this.quotationForm.value.full_name,
        mobile_no: this.quotationForm.value.mobile_no,
        travel_start_date: this.quotationForm.value.travel_start_date,
        traveler_count: (parseInt(this.quotationForm.value.traveler_no_of_adult)+parseInt(this.quotationForm.value.traveler_no_of_child)+parseInt(this.quotationForm.value.traveler_no_of_infant)),
        traveler_no_of_adult: this.quotationForm.value.traveler_no_of_adult,
        traveler_no_of_child: this.quotationForm.value.traveler_no_of_child,
        traveler_no_of_infant: this.quotationForm.value.traveler_no_of_infant
      }
      this.masterService.updateQuotation(formData, this.quotation.id).subscribe((resp:any)=>{
        if(resp.message){
          this.isLoading=false;
          this.dialogRef.close(1);
        }
      });
    }
    
  }
}
