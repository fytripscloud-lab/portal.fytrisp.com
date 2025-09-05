import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { EncryptionService } from '@core/service/encryption.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '@core/service/error.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        RouterLink,
        MatButtonModule,
    ],
})
export class SignupComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  loading = false;
  hide = true;
  chide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private toastr: ToastrService,
    private errorService: ErrorService,
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
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
    const password = this.authForm.get('password');
    const confirmPassword = this.authForm.get('cpassword');
    return password && confirmPassword ? password.value === confirmPassword.value : false;
  }

  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      if (!this.doPasswordsMatch()) {
        this.toastr.error('Passwords do not match', 'Validation Error');
        return;
      }
      this.loading = true;
      const {name, email, mobile_number} = this.authForm.value;
      const password = this.encryptionService.encryptText(this.authForm.value.password);
      // In your registration method:
      this.http.post(`${environment.apiUrl}/admin/registration`, {
        name, 
        email, 
        password, 
        mobile_number, 
        role_id: 1
      }).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.errorService.handleError(error);
        },
        complete: () => {
          //this.loading = false;
        }
      });
    }
  }
}
