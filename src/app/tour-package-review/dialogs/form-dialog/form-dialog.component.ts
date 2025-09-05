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
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
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
        NgIf,
        NgFor
    ],
})
export class FormDialogComponent implements OnInit, OnDestroy {
  action: string;
  dialogTitle: string;
  reviewForm: UntypedFormGroup;
  isLoading: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  autocomplete: any;
  imagePreview: string ='';
  packageList: any = [];
  reviews: any;
  selectedFiles: File[] = [];
  imagePreviews: any = [];
  searchPackage = new FormControl('');
  filteredPackage$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private ngZone: NgZone,
    private validationService: ValidationService,
    private toastr: ToastrService
  ) {
    // Set the defaults
    this.action = data.action;
    this.packageList = data.packages;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Review';
      this.reviews = data.review;
      //this.imagePreview = data.destination?.file_path+'?w=130&h=130';
      data.review.review_images.map((image: any) => {
        this.imagePreviews.push({img:image.file_path+'?w=130&h=130', id:image.encrypt_id});
      });
    } else {
      this.dialogTitle = 'Add Review';      
      this.reviews = {};
    }
    this.reviewForm = this.createReviewForm();
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

  ngOnInit(): void {
    
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
  createReviewForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.reviews?.encrypt_id],
      tour_package_id: [this.reviews?.tour_package?.id, [Validators.required]],
      rating: [this.reviews?.rating?.toString(), [Validators.required]],
      review_text: [this.reviews?.review, [Validators.required]],
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    // const result = this.validationService.validateMultipleImageFiles(files);
    // console.log(result);
    // if (!result.isValid) {
    //   this.toastr.error(result.message);
    //   return;
    // }
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
          this.imagePreviews.push({img:e.target.result, id:''});
        };
        reader.readAsDataURL(file);
      }
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
    this.masterService.addTourpackageReview(this.reviewForm.getRawValue(), this.selectedFiles).subscribe((resp:any)=>{
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

  removeImage(preview:any, index: any) {
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
          if(preview.id){
            this.masterService.deleteReviewImage(preview.id).subscribe((resp:any)=>{
              
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          
        }
      });
      
    }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
