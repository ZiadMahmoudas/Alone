import { Component, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../core/validations/passMatch.vaildator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { IReset } from '../../../core/models/resetPassword';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {

  /* OPen & Closed EYES */
  isEyeOpen = signal(true);
  passwordInputRef = viewChild<ElementRef>('passwordInput');

  confirmPasswordField = viewChild<ElementRef>('confirmPasswordField');
  isConfirmPasswordEyeOpen = signal(true);


  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private token: string | null = null;


  togglePasswordEye(inputElement: HTMLInputElement) {
    this.isEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
  toggleConfirmPasswordEye(inputElement: HTMLInputElement) {
    this.isConfirmPasswordEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }

  /* FORMS FOR Receive password */
  ForgetForm: FormGroup = new FormGroup({});
  constructor(
    private FB: FormBuilder,
    private route: ActivatedRoute,
    private auth: Auth,
    private router: Router,
    private toastr:ToastrService
  ) {
    this.ForgetForm = this.FB.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    },
      { validator: passwordMatchValidator('password', 'confirmPassword') }
    );
  }

  get confirmPassword() {
    return this.ForgetForm.controls['confirmPassword'];
  }
  get password() {
    return this.ForgetForm.controls['password'];
  }



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    setTimeout(() => {
      if (this.passwordInputRef()) {
        this.togglePasswordEye(this.passwordInputRef()!.nativeElement);
      }
      if (this.confirmPasswordField()) {
        this.toggleConfirmPasswordEye(this.confirmPasswordField()!.nativeElement);
      }
    }, 0);


    this.ForgetForm.statusChanges.subscribe(_ => {
      const confirmPasswordControl = this.ForgetForm.get('confirmPassword');

      if (confirmPasswordControl?.touched && !this.ForgetForm.hasError('passwordMismatch')) {
        this.successMatch = true;
        setTimeout(() => {
          this.successMatch = false;
        }, 3000);
      } else {
        this.successMatch = false;
      }
    });
  }


  onsubmit() {
    if (this.ForgetForm.invalid) {
      this.ForgetForm.markAllAsTouched();
      this.toastr.warning("Please Enter All Fields","Not Get AnyThing 😈")
      this.errorMessage = 'Please fix the errors in the form.';
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Password reset token is missing. Please request a new link.';
      return;
    }

    this.loading = true;
  const dataToSend: IReset = {
    token: this.token,
    newPassword: this.ForgetForm.value.password,
    confirmPassword: this.ForgetForm.value.confirmPassword
  };
    this.auth.submitNewPassword(dataToSend).subscribe({
      next: (_) => {
        this.successMessage = 'Password updated successfully! You can check your email to get password';
        setTimeout(()=>{
          this.router.navigate(["/login"]);
        },4000)
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 400) {
            this.errorMessage = 'Invalid or expired password reset token. Please request a new one.';
        } else if (err.status === 401) {
            this.errorMessage = 'Unauthorized: Please check your token.';
        }
        else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }

  successMatch: boolean = false;
}
