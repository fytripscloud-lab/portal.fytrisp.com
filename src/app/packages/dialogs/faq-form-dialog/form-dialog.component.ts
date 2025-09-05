import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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
        NgxMatSelectSearchModule,
        MatProgressSpinnerModule,
        NgIf,
        AsyncPipe
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  faqForm: UntypedFormGroup;
  faqs: any;
  package_id: any;
  isLoading: boolean = false;
  autocomplete: any;
  packageList: any = [];
  searchPackage = new FormControl('');
  filteredPackage$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ) {
    // Set the defaults
    this.action = data.action;
    this.packageList = data.packages;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit FAQ';
      this.faqs = data.faqs;
      this.package_id = data.package_id;
    } else {
      this.dialogTitle = 'Add FAQ';
      this.package_id = data.package_id;
      this.faqs = {};
    }
    this.faqForm = this.createfaqForm();
    this.filteredPackage$.next(this.packageList);
    this.searchPackage.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(search => {
      if (!search) {
        this.filteredPackage$.next(this.packageList.slice());
        return;
      }
      
      // Filter the destinations
      const searchCountry = search.toLowerCase();
      const filtered = this.packageList.filter((country: { package_name: string; }) => 
        country.package_name.toLowerCase().includes(searchCountry)
      );
      this.filteredPackage$.next(filtered);
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
  createfaqForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.faqs?.id],      
      tour_package_id: [{value: this.package_id, disabled: (this.package_id?true:false)}, Validators.required],
      question: [this.faqs?.question, [Validators.required]],
      answer: [this.faqs?.answer],
      is_active: true
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(type:number): void {
    this.isLoading=true;
    this.masterService.addTourFaqList(this.faqForm.getRawValue()).subscribe((resp:any)=>{
      if(resp.message){
        this.isLoading=false;
        this.dialogRef.close(type);
      }
    },
    (error: any) => {
      this.isLoading = false;
      this.toastr.error(error.error.detail);
    });
  }

  public confirmUpdate()
  {
    this.isLoading=true;
    this.masterService.updateTourFaqList(this.faqForm.getRawValue()).subscribe((resp:any)=>{
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
}
