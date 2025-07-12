import { Component } from '@angular/core';
import { DashboardService } from '../../core/services/DashboardServices/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../../core/services/auth/auth';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MetaService } from '../../core/services/meta/meta-service';

@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.html',
  styleUrl: './view.scss'
})
export class View {
  constructor(
    private dashboardService:DashboardService,
    private route:ActivatedRoute,
    private auth:Auth,
    private toastr:ToastrService,
    private router:Router,
    private metaService:MetaService
    ){

    }

    product:any = null ;
    ngOnInit():void{
      const id = this.route.snapshot.params['id'];
      this.dashboardService.getProductId(id).subscribe({
        next:(res)=>{
         this.product = res;
        },
        error:(err)=>{
          console.log(err);

        }
      })

    }
      role:string= 'user';
    decode:any;
    accessToken:any
      roles(){
        this.accessToken = this.auth.getaccessToken();
        this.decode = jwtDecode<{ [key: string]: any }>(this.accessToken);
        this.role = this.decode['role'];
         return this.role==='admin' ? true: false;
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
        this.dashboardService.deleteProductByID(id).subscribe({
          next:(res:any)=>{
             this.product = null;
          this.toastr.success("Delete Successfully");
          this.router.navigate(['/Home']);
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
    }
    )
    }
    edit(id:number){
this.router.navigate(['/Dashboard/Product', id]);
    }
}
