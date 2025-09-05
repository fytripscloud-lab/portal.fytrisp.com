import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../category.model';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from '@core/service/master.service';
import {MatTooltipModule, TooltipPosition} from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { ValidationService } from '@shared/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

export interface DialogData {
  id: number;
  action: string;
  category: Category;
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
        MatDialogClose,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class FormDialogComponent {
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  action: string;
  dialogTitle: string;
  categoryForm: UntypedFormGroup;
  category: Category;
  isLoading: boolean = false;
  imagePreview: string = '';
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
      this.dialogTitle = 'Edit Travel Category';
      this.category = data.category;
      this.imagePreview = data.category.file_path;
    } else {
      this.dialogTitle = 'Add Travel Category';
      const blankObject = {} as Category;
      this.category = new Category(blankObject);      
    }
    this.categoryForm = this.createCategoryForm();
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

  createCategoryForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.category.id],
      name: [this.category.name, [Validators.required]],
      description: [this.category.description],
      meta_title: [this.category.meta_title, [Validators.required]],
      meta_description: [this.category.meta_description],
      meta_keywords: [this.category.meta_keywords],
      meta_tags: [this.category.meta_tags],
      image: [''],
      image_alt: [this.category.image_alt]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const result = this.validationService.validateImageFile(file);
      // const customResult = this.validationService.validateFile(file, {
      //   maxSizeInMB: 5,
      //   allowedTypes: ['image/', 'application/pdf']
      // });
      if (!result.isValid) {
        this.toastr.error(result.message);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview=e.target.result;
      };
      reader.readAsDataURL(file);
      this.categoryForm.patchValue({
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
    this.isLoading = true;
    this.masterService.addTourCategory(this.categoryForm.getRawValue()).subscribe((resp:any)=>{
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
