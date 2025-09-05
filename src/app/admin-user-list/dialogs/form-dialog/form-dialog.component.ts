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
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '@core/service/encryption.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

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
        MatProgressSpinnerModule,
        NgIf
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  userForm: UntypedFormGroup;  
  isLoading: boolean = false;
  hide:boolean = true;
  chide:boolean = true;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private toastr: ToastrService,
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit User';      
    } else {
      this.dialogTitle = 'Create User';      
    }
    this.userForm = this.createUserForm();
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
  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      email: [
        '',
        [Validators.required, Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i), Validators.minLength(5), Validators.maxLength(250)],
      ],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
      mobile_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: UntypedFormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('cpassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  doPasswordsMatch(): boolean {
    const password = this.userForm.get('password');
    const confirmPassword = this.userForm.get('cpassword');
    return password && confirmPassword ? password.value === confirmPassword.value : false;
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  public confirmAdd(): void {
    this.isLoading=true;
    const {name, email, mobile_number} = this.userForm.value;
    const password = this.encryptionService.encryptTextNormal(this.userForm.value.password);
    // In your registration method:
    this.http.post(`${environment.apiUrl}/admin/registration`, {
      name, 
      email, 
      password, 
      mobile_number, 
      role_id: 1
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.dialogRef.close(res);
      },
      error: (error) => {        
        this.isLoading = false;
        this.toastr.error(error?.error?.detail);
      },
      complete: () => {
        //this.loading = false;
      }
    });
  }
}
