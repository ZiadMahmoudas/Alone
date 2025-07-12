import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../../core/services/auth/auth';
import { passwordMatchValidator } from '../../../core/validations/passMatch.vaildator';
import { CommonModule } from '@angular/common';
import ValidatorForm from '../../../core/validations/formsValidators.validators';
import { MetaService } from '../../../core/services/meta/meta-service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  standalone:true,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
isEyeOpen = signal(true);
passwordInputRef = viewChild('passwordInput',{read:ElementRef})

confirmPasswordField = viewChild('#confirmPasswordField',{read:ElementRef})
isConfirmPasswordEyeOpen = signal(true);


 togglePasswordEye(inputElement: any) {
    this.isEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
toggleConfirmPasswordEye(inputElement: any) {
    this.isConfirmPasswordEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
  successMatch:boolean = false;
ngOnInit():void{
  this.metaService.setMeta();
this.toggleConfirmPasswordEye(this.confirmPasswordField);
this.togglePasswordEye(this.passwordInputRef);
this.signupForm.statusChanges.subscribe(status=>{
  const hasError = this.signupForm.hasError("passwordMismatch");
  const confirmTouched = this.signupForm.get("confirmPassword")?.touched;

  if(!hasError && confirmTouched){
    this.successMatch = true;
    setTimeout(()=>{
      this.successMatch =false;
    },3000)
  }
})
}
signupForm:FormGroup = new FormGroup('');
constructor(
  private tostar:ToastrService,
  private FB:FormBuilder,
  private auth:Auth,
  private router:Router,
  private metaService:MetaService
  ){
  this.signupForm = this.FB.group({
    firstName:['',[Validators.required,Validators.pattern(/[a-z]{2,}/i)]],
    lastName:['',[Validators.required,Validators.pattern(/[a-z]{2,}/i)]],
    email:['',
      [Validators.required,
        Validators.email,
      Validators.pattern(/\w+@(gmail|mail|outlook).(com|net|org)$/i)],
    ],
    userName:['',[Validators.required,Validators.pattern(/[a-z]{2,}/i)]],
    password:['',[Validators.required]],
    confirmPassword:['',[Validators.required]],
  },
  {
    validator: passwordMatchValidator('password', 'confirmPassword')
  }
)
}

  get userName(){
    return this.signupForm.controls['userName'];
  }
  get password(){
    return this.signupForm.controls['password'];
  }
  get firstName(){
    return this.signupForm.get("firstName");
  }
  get lastName(){
    return this.signupForm.controls['lastName'];
  }
  get email(){
    return this.signupForm.controls['email'];
  }
  get confirmPassword(){
    return this.signupForm.controls['confirmPassword'];
  }

onsubmit(){
if(this.signupForm.invalid){
     ValidatorForm.ValidateAllFormFields(this.signupForm);
    this.tostar.warning("Please Enter All Fields","Not Get AnyThing 😈")
  return;
}
this.auth.signup(this.signupForm.value).subscribe({
  next:(res:any)=>{
    this.tostar.success("Thanks For Success in my website","Welcome happy For you");
      this.auth.saveNewTokens(res);
            this.signupForm.reset();
      this.router.navigate(['/Home']);
  },
  error:(err)=>{
    if(err.status === 409)
      this.tostar.error("😬Oops Conflict:This Email is Already Exist");
  }
})
}
invalidLogin:boolean = false;
isInvalid(controlName: string): any {
  const control = this.signupForm.get(controlName);
  if (!control) return false;

  return (control.invalid && (control.dirty || control.touched)) || this.invalidLogin;
}
isValid(controlName: string): any {
  const control = this.signupForm.get(controlName);
  if (!control) return false;

  return control.valid && (control.dirty || control.touched) && !this.invalidLogin;
}
}
