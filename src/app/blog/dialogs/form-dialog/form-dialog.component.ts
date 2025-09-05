import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
declare const google: any;

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
        AsyncPipe,
        NgxMatSelectSearchModule,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class FormDialogComponent implements OnInit, OnDestroy {
  dialogTitle: string;
  destinationForm: UntypedFormGroup;  
  isLoading: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;
  destinationList:any = [];

  private _onDestroy = new Subject<void>();
  searchCtrl = new FormControl('');
  filteredDestinations$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,        
    private toastr: ToastrService
  ) {
    // Set the defaults       
    this.dialogTitle = 'Auto Post Blog';    
    this.destinationForm = this.createDestinationForm();   
    
  }

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations() {
  this.masterService.getAllDestinationList().subscribe({
    next: (res: any) => {
      this.destinationList = res.data;      
      this.filteredDestinations$.next(res.data);
      this.searchCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(search => {
        if (!search) {
          this.filteredDestinations$.next(this.destinationList.slice());
          return;
        }
        
        // Filter the destinations
        const searchStr = search.toLowerCase();
        const filtered = this.destinationList.filter((destination: { name: string; }) => 
          destination.name.toLowerCase().includes(searchStr)
        );
        this.filteredDestinations$.next(filtered);
      });  
    }
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
      destination_ids: ['', [Validators.required]]
    });
  }
  
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.isLoading=true;
    console.log(this.destinationForm.value);
    this.masterService.autoPostBlog(this.destinationForm.value).subscribe((resp:any)=>{
      if(resp.message){
        this.isLoading=false;
        this.dialogRef.close(resp.message);
      }
    },
    (error: any) => {
      this.isLoading = false;
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
