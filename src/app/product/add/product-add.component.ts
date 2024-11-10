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
    id: '',  // ID có thể không cần nhập nếu sử dụng tự động tăng hoặc do backend tạo
    name: '',
    quantity: 0,
    price: 0,
    description: '',
    status: '',  // Có thể định nghĩa status là 'active' hoặc 'inactive' tùy vào yêu cầu
    image1: '',   // Cần xử lý upload file
    image2: ''    // Cần xử lý upload file
  };

  constructor(private productService: ProductService, private router: Router) {}

  // Thêm sản phẩm mới
  addProduct(): void {
    // Kiểm tra tính hợp lệ của thông tin đầu vào trước khi gửi yêu cầu
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.quantity) {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
      return;
    }
  
    // Gọi service để thêm sản phẩm
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        alert('Sản phẩm đã được thêm thành công!');
        // Điều hướng về trang danh sách sản phẩm sau khi thêm thành công
        this.router.navigate(['/products']);
      },
      error: () => {
        alert('Có lỗi xảy ra khi thêm sản phẩm!');
      }
    });
  }
  
}
