import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { notReturnLoginGuard } from './core/guards/not-return-login-guard';
import { dashboardGuard } from './core/guards/dashboard-guard';

export const routes: Routes = [
  {path:"",pathMatch:"full",title:"signup",redirectTo:"signup"},
  {path:"signup",
  title:"signup",
    loadComponent:()=>import("./pages/auth/signup/signup").then((c)=>c.Signup),
    canActivate:[notReturnLoginGuard],
    data:{

      description:"signup Page Hi Good"
    }
  },
  {path:"forgetPassword",title:"forgetPassword",loadComponent:()=>import("./pages/auth/forget-password/forget-password").then((c)=>c.ForgetPassword),canActivate:[notReturnLoginGuard]},
  {path:"passwordReset",title:"passwordReset",loadComponent:()=>import("./pages/auth/reset-password/reset-password").then((c)=>c.ResetPassword),canActivate:[notReturnLoginGuard]},
  { path: 'confirm-password-change', loadComponent:()=>import("./pages/auth/confirm-password-change/confirm-password-change").then((c)=>c.ConfirmPasswordChangeComponent),title:"Confirm-Change-password",canActivate:[notReturnLoginGuard] },
  {path:"login",
    loadComponent:()=>import("./pages/auth/login/login").then((c)=>c.Login),
    title:"login",
    canActivate:[notReturnLoginGuard],
      data:{
      description:"login Page Hi Bye"
    }
  },
  {
    path:"Home",
    title:"Home",
    loadComponent:()=>import("./pages/home/home").then((c)=>c.Home),
    canActivate:[authGuard],
  },
     {
        path:"view/:id",
        title:"VIEW_PRODUCT",
        loadComponent:()=>import("./pages/view/view").then((c)=>c.View),
         canActivate:[authGuard],
      },
  {path:"Dashboard",title:"Dashboard",loadComponent:()=>import("./pages/admin/dashboard/dashboard").then((c)=>c.Dashboard),canMatch:[dashboardGuard],
    children:[
      {path:"users",title:"users",loadComponent:()=>import("./pages/admin/dashboard/users/users").then(c=>c.Users)},
      {
        path:"Product",
        title:"Product",
        loadComponent:()=>import("./pages/admin/dashboard/generate-product/generate-product").then(c=>c.GenerateProduct)
      },
      {
  path: 'Product/:id',
  title: 'Edit Product',
  loadComponent: () => import('./pages/admin/dashboard/generate-product/generate-product').then(c => c.GenerateProduct)
}
  ]},
  {
    path:"Cart",
    title:"Cart",
    loadComponent:()=>import('./pages/cart/cart').then(c=>c.Cart),
    canActivate:[authGuard]
  },
  {
    path:"WishList",
    title:"WishList",
    loadComponent:()=>import('./pages/wishlist/wishlist').then(c=>c.Wishlist),
    canActivate:[authGuard]
  },
  {
    path:"Order",
    title:"Orders",
    loadComponent:()=>import('./pages/order/order').then(c=>c.Order),
    canActivate:[authGuard]
  },
  {path:"**",title:"404",loadComponent:()=>import("./main-layout/not-found/not-found").then((c)=>c.NotFound)},
];
