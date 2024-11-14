import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;

  // Tiêm Router vào constructor
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Tải danh sách sản phẩm
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log(data)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Có lỗi xảy ra khi tải dữ liệu sản phẩm!');
      }
    });
  }

  // Điều hướng đến trang chỉnh sửa sản phẩm với ID trong URL
  editProduct(id: string): void {
    this.router.navigate(['/products/edit', id]); // Sử dụng router để điều hướng
  }

  // Xóa sản phẩm
  deleteProduct(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== id);
          alert('Sản phẩm đã được xóa thành công!');
        },
        error: () => {
          alert('Có lỗi xảy ra khi xóa sản phẩm!');
        }
      });
    }
  }
}
