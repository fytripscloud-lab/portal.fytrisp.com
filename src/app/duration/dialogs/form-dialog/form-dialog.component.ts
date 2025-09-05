import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Duration } from '../../duration.model';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface DialogData {
  id: number;
  action: string;
  duration: Duration;
  destinations: any;
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
        NgxMatSelectSearchModule,
        AsyncPipe,
        MatCardModule,
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  durationForm: UntypedFormGroup;
  duration: Duration;
  destinations: any;
  isLoading: boolean = false;
  searchCtrl = new FormControl('');
  imagePreview: string = '';

  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private validationService: ValidationService,
    private toastr: ToastrService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Duration';
      this.duration = data.duration;
      this.destinations = data.destinations;
      this.durationForm = this.editDestinationForm(this.duration);
      this.imagePreview = data.duration?.file_path;
    } else {
      this.dialogTitle = 'Add Duration';
      const blankObject = {} as Duration;
      this.duration = new Duration(blankObject);
      this.destinations = data.destinations;
      this.durationForm = this.createDestinationForm();
    }
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
    return this.fb.group({
      id: [this.duration.id],
      destination_id: ['', [Validators.required]],
      no_of_days: ['', [Validators.required]],
      image: ['', [Validators.required]]
    });
  }

  editDestinationForm(duration: Duration): UntypedFormGroup {
    return this.fb.group({
      id: [duration.id],
      destination_id: [duration.destination?.id, [Validators.required]],
      no_of_days: [duration.no_of_days, [Validators.required]],
      image: ['']
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
      this.durationForm.patchValue({
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
    this.masterService.addTourDuration(this.durationForm.getRawValue()).subscribe((resp:any)=>{
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
