import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EncryptionService } from '@core/service/encryption.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionService } from '@core/service/permission.service';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        NgIf,
        MatProgressSpinnerModule
    ],
})
export class SigninComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  rememberMe: boolean = true;
  returnUrl!: string;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private http: HttpClient,
    private toastr: ToastrService,
    public permissionService: PermissionService
  ) {}

  ngOnInit() {
    if(this.authService.isAuthenticatedUser())
    {
      this.router.navigate(['/dashboard/main']);
    }

    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]],
      password: ['', Validators.required],
      rememberMe: [true]
    });
  }

  get f() {
    return this.authForm.controls;
  }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    
    if (this.authForm.invalid) {
      this.error = 'Email and Password not valid!';
      return;
    }
  
    // Show loading state
    this.loading = true;
  
    const { email } = this.authForm.value;
    const encrypted_password = this.encryptionService.encryptText(this.f['password'].value);
    //this.authForm.patchValue({ password: encrypted_password });
    this.authForm.value.password = encrypted_password;
  
    this.authService.login(this.authForm.value).subscribe({
      next: (resp:any) => {
        this.permissionService.setPermissions(resp?.role_permissions);
        this.router.navigate(['/dashboard/main']);
      },
      error: (error) => {
        this.loading = false;
        if(error.status=400){
          if (error.error.password) {
            this.toastr.error(error.error.password[0]);
          }
        }
        if(error.status=401){
          if (error.error.detail) {
            this.toastr.error(error.error.detail);
          }
        }
        if(error.status=500){
          if (error.error.detail) {
            this.toastr.error(error.error.detail);
          }
        }
        // Handle error (show message to user)
      }
    });
  }
  
}
