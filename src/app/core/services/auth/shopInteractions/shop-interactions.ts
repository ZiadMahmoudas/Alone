import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { API_URL } from '../../../tokens/token';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '../auth';

@Injectable({ providedIn: 'root' })
export class ShopInteractions {

    private readonly auth = inject(Auth);
  private readonly baseUrl = inject(API_URL);
/* WishList */
private _wishlistCount = new BehaviorSubject<number>(0);
wishlistCount$ = this._wishlistCount.asObservable();

private _wishlistItems = new BehaviorSubject<number[]>([]);
wishlistItems$ = this._wishlistItems.asObservable();



  constructor(private http: HttpClient) {}
setFavoriteIds(ids: number[]) {
  this._wishlistItems.next(ids);
}
  getWishList() {
    return this.http.get(`${this.baseUrl}/WishList`);
  }

  addToWishList(productId: number): Observable<any>  {
    return this.http.post(`${this.baseUrl}/WishList`,{ productId });
  }

  updateWishListCount() {
    this.getWishList().subscribe({
      next: (res: any) => this._wishlistCount.next(res.length),
      error: (err) => console.error(err)
    });
  }
removeFromWishList(productId:any):any{
  return this.http.delete(`${this.baseUrl}/WishList/${productId}`)
}

/* CartItems */


}
