import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
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
export class ChangePasswordComponent {
  dialogTitle: string;
  changePassForm: UntypedFormGroup;  
  isLoading: boolean = false;
  hide1:boolean = true;
  hide2:boolean = true;
  hide3:boolean = true;
  chide:boolean = true;
  userId: string;
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private toastr: ToastrService,
  ) {
    // Set the defaults
    this.userId = data?.user_id;
    this.dialogTitle = 'Change Password'
    this.changePassForm = this.createForm();
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
  createForm(): UntypedFormGroup {
    return this.fb.group({
      user_id: [this.userId, [Validators.required]],
      current_password: ['', [Validators.required]],
      new_password: ['', Validators.required],
      confirm_new_password: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

  doPasswordsMatch(): boolean {
    const password = this.changePassForm.get('password');
    const confirmPassword = this.changePassForm.get('cpassword');
    return password && confirmPassword ? password.value === confirmPassword.value : false;
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassFormSubmit(){
    if(this.changePassForm.valid)
    {
      this.isLoading=true;
      this.changePassForm.value.current_password = this.encryptionService.encryptTextNormal(this.changePassForm.value.current_password);
      this.changePassForm.value.new_password = this.encryptionService.encryptTextNormal(this.changePassForm.value.new_password);
      this.changePassForm.value.confirm_new_password = this.encryptionService.encryptTextNormal(this.changePassForm.value.confirm_new_password);
      this.masterService.changeAdminUserPassword(this.changePassForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.dialogRef.close(1);
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
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('new_password');
  const confirmPassword = control.get('confirm_new_password');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}