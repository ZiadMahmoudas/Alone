import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../../../core/services/DashboardServices/dashboard.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-product',
  imports: [ReactiveFormsModule],
  templateUrl: './generate-product.html',
  styleUrl: './generate-product.scss'
})
export class GenerateProduct {
  constructor(
    private tostar:ToastrService
    ,private dashboardSerivces:DashboardService
    ,private FB:FormBuilder,
     private route:ActivatedRoute
  ){
  this.addProduct =this.FB.group({
      productName:['',[Validators.required]],
      productDiscount:['',Validators.required],
      productCategory:['',Validators.required],
      productPrice:['',Validators.required],
      productDescription:['',Validators.required],
      productQuantity:['',Validators.required],
    productImage: ['', this.isEdit ? [] : [Validators.required]]

      })

    const productId:number = this.route.snapshot.params['id'];
  if (productId) {
    this.isEdit = true;
    this.editProductId = productId;
    this.dashboardSerivces.getProductId(productId).subscribe((product:any) => {
      this.addProduct.patchValue({
        productName: product.name,
        productDiscount: product.discount,
        productPrice: product.price,
        productDescription: product.description,
        productQuantity: product.quantity,
      });
    });
  }
    }
    isEdit: boolean = false;
editProductId: string|any | null|number = null;
    get productName(){
      return this.addProduct.controls["productName"];
    }
    get productDiscount(){
      return this.addProduct.controls["productDiscount"];
    }
    get productPrice(){
      return this.addProduct.controls["productPrice"];
    }
    get productDescription(){
      return this.addProduct.controls["productDescription"];
    }
    get productCategory(){
      return this.addProduct.controls["productCategory"];
    }
    get productQuantity(){
      return this.addProduct.controls["productQuantity"];
    }
    get productImage(){
      return this.addProduct.controls["productImage"];
    }

addProduct:FormGroup = new FormGroup('');
onSubmit() {
  if (this.addProduct.invalid) {
    this.tostar.warning("Select Items Please");
    return;
  }

  const formData = new FormData();
  formData.append("ProductName", this.addProduct.get("productName")?.value);
  formData.append("productDescription", this.addProduct.get("productDescription")?.value);
  formData.append("productPrice", this.addProduct.get("productPrice")?.value);
  formData.append("productDiscount", this.addProduct.get("productDiscount")?.value);
  formData.append("productQuantity", this.addProduct.get("productQuantity")?.value);

  const imageInput = document.getElementById("productImage") as HTMLInputElement;
  const file = imageInput?.files?.[0];
  if (file) {
    formData.append("Image", file);
  } else {
    this.tostar.error("Please select a valid image.");
    return;
  }

  if (this.isEdit && this.editProductId) {
    this.dashboardSerivces.updateProduct(this.editProductId, formData).subscribe({
      next: () => this.tostar.success("Product Updated Successfully"),
      error: (err) => {
        this.tostar.error(err.message);
      },
    });
  } else {
    this.dashboardSerivces.addProductsItems(formData).subscribe({
      next: () => this.tostar.success("Product Added Successfully"),
      error: (err) => this.tostar.error(err.message),
    });
  }
}

}
