import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  product: Product = {
    id: '',
    name: '',
    quantity: 0,
    price: 0,
    description: '',
    status: '',
    image1: '',
    image2: ''
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: () => {
          alert('Không tìm thấy sản phẩm với ID này!');
          this.router.navigate(['/products']); // Điều hướng về danh sách sản phẩm nếu không tìm thấy
        }
      });
    } else {
      alert('Không có ID sản phẩm!'); // Thông báo lỗi nếu không có ID trong URL
      this.router.navigate(['/products']);
    }
  }

  // Cập nhật thông tin sản phẩm
  updateProduct(): void {
    if (!this.product.id) {
      alert('ID sản phẩm không hợp lệ!');
      return;
    }

    this.productService.updateProduct(this.product.id, this.product).subscribe({
      next: () => {
        alert('Cập nhật sản phẩm thành công!');
        this.router.navigate(['/products']); // Điều hướng về danh sách sản phẩm sau khi cập nhật thành công
      },
      error: (error) => {
        alert('Có lỗi xảy ra khi cập nhật sản phẩm! ' + error.message);
      }
    });
  }
}
