import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../tokens/token';
import { BrowserStorage } from '../browserStorage/browser-storage';
import { Isignup } from '../../models/usersignup';
import { Ilogin } from '../../models/userlogin';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IReset } from '../../models/resetPassword';


@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(
    private http:HttpClient
    ,private storage:BrowserStorage,
    private router:Router
  ) { }
  private readonly baseURL:string = inject(API_URL);
  // you should name this came from backend
  accessToken:string = "accessToken";
  refreshToken:string = "refreshToken";
  getaccessToken(){

 return this.storage.get(this.accessToken);

  }
   getrefreshToken():any{
  return  this.storage.get(this.refreshToken)
  }
    saveNewTokens(tokens: { accessToken: string, refreshToken: string }) {
 if (tokens.accessToken && tokens.refreshToken) {
    this.storage.set(this.accessToken, tokens.accessToken);
    this.storage.set(this.refreshToken, tokens.refreshToken);
  }
  }
  removeaccessToken(){
    this.storage.remove(this.accessToken);
    this.storage.remove(this.refreshToken);
  }
  logout(){
this.removeaccessToken();
this.router.navigate(['/login']);
}


RefreshToken(token: string) {
  return this.http.post(`${this.baseURL}/Users/RefreshToken`,
    { refreshToken: token },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  );
}
  signup(data:Isignup){
  return this.http.post(`${this.baseURL}/Users/register`,data);
  }
  login(data:Ilogin){
   return this.http.post(`${this.baseURL}/Users/login`,data);
  }
forgetPassword(data:any){
return this.http.post<any>(`${this.baseURL}/Users/forget-password`,data
);
}
  submitNewPassword(data:IReset): Observable<any> {
    return this.http.post(`${this.baseURL}/Users/submit-new-password`, data);
  }
 confirmPasswordChange(token: string, action: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('action', action);
    return this.http.get(`${this.baseURL}/Users/confirm-password-change`, { params: params });
  }
}
