import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import ValidatorForm from '../../../core/validations/formsValidators.validators';
import { CommonModule } from '@angular/common';
import { MetaService } from '../../../core/services/meta/meta-service';
@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

isEyeOpen = signal(true);
passwordInputRef = viewChild('passwordInput',{read:ElementRef})
  togglePasswordEye(inputElement: any) {
    this.isEyeOpen.update((val) => {
      const newState = !val;
      inputElement.type = newState ? 'text' : 'password';
      return newState;
    });
  }
  ngOnInit():void{
    this.metaService.setMeta();
this.togglePasswordEye(this.passwordInputRef);

  }
  loginForm:FormGroup = new FormGroup('');

  constructor(
    private FB:FormBuilder,
    private auth:Auth,
    private toastr:ToastrService,
    private router:Router,
    private metaService:MetaService
  ){
   this.loginForm = this.FB.group({
    userName:['',[Validators.required,Validators.pattern(/[a-z]{2,}/i)]],
    password:['',[Validators.required]],
    });

  }
  get userName(){
    return this.loginForm.controls['userName'];
  }
  get password(){
    return this.loginForm.controls['password'];
  }
invalidLogin:boolean = false;
  onsubmit(){
  if(this.loginForm.invalid){
   ValidatorForm.ValidateAllFormFields(this.loginForm)
    this.toastr.warning("Please Enter All Fields","Not Get AnyThing 😈")
    return;
  }

  this.auth.login(this.loginForm.value).subscribe({
    next:(res:any)=>{
      this.auth.saveNewTokens(res);
      this.toastr.success("Thanks For Success in my website","Welcome happy For you");
      this.loginForm.reset();
       setTimeout(() => this.router.navigate(['/Home']), 200);
    },
    error:()=>{
      this.invalidLogin = true;
      this.toastr.error("This User unAuthroized To Get HomePage","retry again");
    }
  })
  }
isInvalid(controlName: string): any {
  const control = this.loginForm.get(controlName);
  if (!control) return false;
  if (this.invalidLogin && control.dirty && !control.invalid) {
    return false;
  }

  return (control.invalid && (control.dirty || control.touched)) || this.invalidLogin;
}
isValid(controlName: string): any {
  const control = this.loginForm.get(controlName);
  if (!control) return false;

  return control.valid && (control.dirty || control.touched) && !this.invalidLogin;
}
}
