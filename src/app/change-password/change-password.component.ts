import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EncryptionService } from '@core/service/encryption.service';
import { MasterService } from '@core/service/master.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [BreadcrumbComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {

  breadscrums = [
    {
      title: 'Change Password',
      items: ['Home'],
      active: 'Change Password',
    }
  ];
  hide = true;
  changePassForm: UntypedFormGroup;

  constructor(private _formBuilder: FormBuilder, private masterService: MasterService, private toastr: ToastrService, private encryptionService: EncryptionService){
    this.changePassForm = this._formBuilder.group({
                          current_password: ['', [Validators.required]],
                          new_password: ['', Validators.required],
                          confirm_new_password: ['', Validators.required]
                        }, {
                          validators: passwordMatchValidator
                        });
  }

  ngOnInit(): void {
    
  }

  get newPassword() { return this.changePassForm.get('new_password'); }
  get confirmPassword() { return this.changePassForm.get('confirm_new_password'); }

  changePassFormSubmit(){
    if(this.changePassForm.valid)
    {
      this.changePassForm.value.current_password = this.encryptionService.encryptText(this.changePassForm.value.current_password);
      this.changePassForm.value.new_password = this.encryptionService.encryptText(this.changePassForm.value.new_password);
      this.changePassForm.value.confirm_new_password = this.encryptionService.encryptText(this.changePassForm.value.confirm_new_password);
      this.masterService.changePassword(this.changePassForm.value).subscribe((resp:any)=>{
        if(resp.message){
          this.toastr.success(resp.message);
          this.changePassForm.reset();
        }
      })
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