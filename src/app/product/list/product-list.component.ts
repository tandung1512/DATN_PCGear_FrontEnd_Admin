import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Dữ liệu từ backend:', data); // Kiểm tra giá trị của `isHot`
        
        // Chuyển đổi trường `isHot` nếu backend trả về giá trị không đúng kiểu
        this.products = data.map((product) => {
          // In ra để kiểm tra giá trị của product
          console.log('Product isHot:', product.isHot);
          
          // Không cần chuyển đổi vì là boolean, chỉ đảm bảo có trường `isHot`
          product.isHot = product.isHot === true;  // Đảm bảo isHot là boolean
          
          return product;
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Có lỗi xảy ra khi tải dữ liệu sản phẩm! ' + (error.message || error);
      }
    });
  }
  
  
  
  

  // Điều hướng đến trang chỉnh sửa sản phẩm với ID trong URL
  editProduct(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  // Xóa sản phẩm
  deleteProduct(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // Xóa sản phẩm trong danh sách mà không cần tải lại dữ liệu
          this.products = this.products.filter(product => product.id !== id);
          alert('Sản phẩm đã được xóa thành công!');
        },
        error: (error) => {
          alert('Có lỗi xảy ra khi xóa sản phẩm! ' + (error.message || error));
        }
      });
    }
  }
}
