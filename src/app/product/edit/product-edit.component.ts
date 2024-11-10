import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  product: Product | undefined;

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
          alert('Không tìm thấy sản phẩm!');
        }
      });
    }
  }

  // Cập nhật thông tin sản phẩm
  updateProduct(): void {
    if (this.product) {
      this.productService.updateProduct(this.product.id, this.product).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.router.navigate(['/products']);
        },
        error: () => {
          alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
        }
      });
    }
  }
}
