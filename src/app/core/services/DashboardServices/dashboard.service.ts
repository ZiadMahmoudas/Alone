import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Idashboard } from '../../models/dashboard';
import { API_URL } from '../../tokens/token';
import { Observable } from 'rxjs';
import { IAddProduct } from '../../models/addProduct';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) { }
  private readonly baseURL:string = inject(API_URL);
  getAllUsers(){
  return this.http.get<{ users: Idashboard[] }>(`${this.baseURL}/Users/all-users`);
  }
  deleteUser(id:number): Observable<any>{
    return this.http.delete(`${this.baseURL}/Users/user/${id}`);
  }
  addProductsItems(data:any){
    return this.http.post(`${this.baseURL}/Products/products`,data);
  }
  getAllProducts(){
    return this.http.get(`${this.baseURL}/Products/all-products`);
  }
  getProductId(id:number){
    return this.http.get(`${this.baseURL}/Products/product/${id}`);
  }
  deleteProductByID(id:number){
    return this.http.delete(`${this.baseURL}/Products/product/${id}`);
  }
  updateProduct(id:number,data:any){
    return this.http.put(`${this.baseURL}/Products/${id}`,data);
  }
}
