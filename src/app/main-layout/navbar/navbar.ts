import { Component, DOCUMENT, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth/auth';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { ThemeService } from '../../core/services/theme/theme-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LangService } from '../../core/services/lang/lang';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/DashboardServices/dashboard.service';
import { ShopInteractions } from '../../core/services/auth/shopInteractions/shop-interactions';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,FormsModule,CommonModule],
  standalone:true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  constructor(
    private router:Router,
    public auth:Auth,
    private tostar:ToastrService,
    private themeService:ThemeService,
    private renderer:Renderer2,
    @Inject(DOCUMENT) private document:Document,
    @Inject(PLATFORM_ID) private plateformId:Object,
    public langService: LangService,
    private dashboardService: DashboardService,
    private shopInteraction:ShopInteractions
  ){}
//SearchItems
  products:any = [];
  searchResults:any = [];
  searchTerm:any = '';
  onSearchChange(): void {
  const term = this.searchTerm.toLowerCase().trim();
  if (term.length === 0) {
    this.searchResults = [];
    return;
  }
    this.searchResults = this.products.filter((product:any) =>
    product.name.toLowerCase().includes(term)
  ).slice(0, 5);
}
goToProduct(id: number): void {
  this.searchTerm = '';
  this.searchResults = [];
  this.router.navigate(['/view', id]);
}
  isDarkMode = false;
  wishlistCount: number = 0;
  ngOnInit():void{
  this.dashboardService.getAllProducts().subscribe({
    next:()=>{
      this.shopInteraction.wishlistCount$.subscribe((count:any) => {
    this.wishlistCount = count;
  });
     this.shopInteraction.updateWishListCount();
    }
  })
  //Theme
   if (isPlatformBrowser(this.plateformId)) {
      const theme = this.themeService.getTheme();
      if (theme === 'dark') {
        this.renderer.addClass(this.document.body, 'dark-theme');
      } else {
        this.renderer.removeClass(this.document.body, 'dark-theme');
      }
    }
    this.roles();
  }

   toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
      const isDark = this.document.body.classList.contains('dark-theme');
  if (isDark) {
    this.renderer.removeClass(this.document.body, 'dark-theme');
    this.themeService.setTheme('light');
  } else {
    this.renderer.addClass(this.document.body, 'dark-theme');
    this.themeService.setTheme('dark');
  }
  }
//logout
logout(){
this.auth.removeaccessToken();
this.tostar.success("You have successfully logged out.");
this.router.navigate(["/login"]);
}
// roles
role:string = '';
decode:any;
accessToken:any
  roles(){
    this.accessToken = this.auth.getaccessToken();
  if (!this.accessToken) return;
    this.decode = jwtDecode<{ [key: string]: any }>(this.accessToken);
    this.role = this.decode['role'];
     return this.role==='admin' ? true: false;
  }
   //changeLang
changeLanguage(lang:string) {
    this.langService.toggleLang();
  }

}
