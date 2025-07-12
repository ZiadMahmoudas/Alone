import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DashboardService } from '../../core/services/DashboardServices/dashboard.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MetaService } from '../../core/services/meta/meta-service';
import { CommonModule } from '@angular/common';
import { ShopInteractions } from '../../core/services/auth/shopInteractions/shop-interactions';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule,CarouselModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay:true,
    autoplaySpeed:2000,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  products:any =[]
  constructor(
    private dashboardServices:DashboardService
    ,private auth:Auth,
    private router:Router,
    private toastr:ToastrService,
    private metaService:MetaService,
    private shopInteraction:ShopInteractions,
  ){}
  isWishlistLoaded: boolean = false;
loadWishList() {
  this.shopInteraction.getWishList().subscribe({
    next: (wishlist: any) => {
      const ids = wishlist
        .filter((item:any) => item?.productId != null)
        .map((item:any) => +item.productId)
        .filter((id:number) => !isNaN(id));

      this.favoritedProductIds =new Set(ids);

      this.isWishlistLoaded = true;
      this.loadMoreProducts();
    },
    error: (err) => {
      console.error('Wishlist load error:', err);
     this.favoritedProductIds.clear()
      this.isWishlistLoaded = true;
      this.loadMoreProducts();
    }
  });
}



  ngOnInit() {
  this.metaService.setMeta();

  this.dashboardServices.getAllProducts().subscribe({
    next: (res: any) => {
      this.products = res;
        this.loadWishList();
        this.isWishlistLoaded = true;
        this.loadMoreProducts();
    },
    error: (err) => {
      console.log(err);
    }
  });
}


  showViewAllButton: boolean = true
  displayedProducts: any[] = [];
  currentPage: number = 0;
   productsPerPage: number = 6;
    loadMoreProducts(): void {
    const startIndex = this.currentPage * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    const newProducts = this.products.slice(startIndex, endIndex);
    this.displayedProducts = this.displayedProducts.concat(newProducts);
    this.currentPage++;
    if (this.displayedProducts.length >= this.products.length) {
      this.showViewAllButton = false;
    } else {
      this.showViewAllButton = true;
    }
  }

  role: string = 'user';
  decode: any;
  accessToken: any;
roles() {
  this.accessToken = this.auth.getaccessToken();
  if (!this.accessToken) return false;
  this.decode = jwtDecode<{ [key: string]: any }>(this.accessToken);
  this.role = this.decode['role'];
  return this.role === 'admin';
}
      deleteProduct(id:number){
          Swal.fire({
                  title: 'هل أنت متأكد؟',
                  text: "لن تتمكن من التراجع عن هذا!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'نعم، احذفه!',
                  cancelButtonText: 'إلغاء',
                }).then((result) => {
                  if (result.isConfirmed) {
        this.dashboardServices.deleteProductByID(id).subscribe({
          next:(res:any)=>{
            this.displayedProducts = this.displayedProducts.filter((user: any) => user.id !== id);
          this.toastr.success(res.message);
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
    })
  }

@ViewChild('shopSection') shopSection!: ElementRef;

scrollToShop() {
  this.shopSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
}
view(id:number){
  this.router.navigate(['/view',id]);
}
edit(id:number){
this.router.navigate(['/Dashboard/Product', id]);
}
isFavorited:boolean = false;
sup:Subscription = new Subscription();
ngOnDestroy():void{
   this.sup.unsubscribe();
}
favoritedProductIds = new Set<number>() ;
isProductFavorited(productId: number): boolean {
  return this.favoritedProductIds.has(productId);
}

toggleFavorite(product: any) {
  if (this.isProductFavorited(product.id)) {
    this.shopInteraction.removeFromWishList(product.id).subscribe({
      next: () => {
        this.toastr.info('Remove This item from wishlist ');
        this.favoritedProductIds.delete(product.id);
        this.shopInteraction.updateWishListCount();
      }
    });
  } else {
    this.shopInteraction.addToWishList(product.id).subscribe({
      next: () => {
        this.toastr.success('تمت إضافة المنتج إلى المفضلة');
      this.favoritedProductIds.add(product.id)
        this.shopInteraction.updateWishListCount();
      },
    });
  }
}




  }

