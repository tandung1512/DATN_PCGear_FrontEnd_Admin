import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html'
})
export class ProductAddComponent {
  newProduct: Product = {
    id: '',
    name: '',
    quantity: 0,
    price: 0,
    description: '',
    status: '',
    image1: '',
    image2: ''
  };

  constructor(private productService: ProductService, private router: Router) {}

  // Thêm sản phẩm mới
  addProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        alert('Sản phẩm đã được thêm thành công!');
        this.router.navigate(['/products']);
      },
      error: () => {
        alert('Có lỗi xảy ra khi thêm sản phẩm!');
      }
    });
  }
}
