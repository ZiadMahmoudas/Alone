import { Component } from '@angular/core';
import { ShopInteractions } from '../../core/services/auth/shopInteractions/shop-interactions';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist {

  constructor(
    private wishListService:ShopInteractions,
    private toaster:ToastrService,
  ){}
  ngOnInit():void{
this.getAllWishList();
  }
  getAllWishList(){
    this.wishListService.getWishList().subscribe({
      next:(data:any)=>{
       this.wishLists = data;
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }
    wishLists:any[] = [];
  removeWishList(id:number){
   Swal.fire({
     title: 'هل أنت متأكد؟',
     text: "لن تتمكن من التراجع عن هذا!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'نعم، احذفه!',
     cancelButtonText: 'إلغاء',
   }).then((result) => {
     if (result.isConfirmed) {

       this.wishListService.removeFromWishList(id).subscribe({
         next: (res:any) => {
           this.wishListService.updateWishListCount();
            this.wishLists = this.wishLists.filter(w => w.productId !== id);
           this.toaster.success("Remove This WishList 😭")
         },
         error: (err:any) => {
           console.log(err.status);
           this.toaster.error("Error something Wrong");
         }
       });
     }
   });
  }
}
