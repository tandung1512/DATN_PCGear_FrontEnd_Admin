import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CategoryService } from 'src/app/category/category.service';
import { DistinctiveService } from 'src/app/distinctive/distinctive.service';
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
    image1: null, // Dùng null để chỉ ra khi không có file
    image2: null,
    category: '',
    distinctiveIds: '' ,
  };

  categories: { id: string, name: string }[] = [];
  distinctives: { id: string, name: string }[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private distinctiveService: DistinctiveService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
          // Đảm bảo distinctiveIds là mảng
          this.product.distinctiveIds = this.product.distinctiveIds;
        },
        error: () => {
          alert('Không tìm thấy sản phẩm với ID này!');
          this.router.navigate(['/products']);
        }
      });
    } else {
      alert('Không có ID sản phẩm!');
      this.router.navigate(['/products']);
    }

    // Fetch categories
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        alert('Không thể tải danh sách danh mục!');
      }
    });

    // Fetch distinctives
    this.distinctiveService.getAllDistinctives().subscribe({
      next: (data) => {
        this.distinctives = data;
      },
      error: () => {
        alert('Không thể tải danh sách distinctives!');
      }
    });
  }

  // Handle file change for images
  onFileChange(event: any, imageField: 'image1' | 'image2'): void {
    const file = event.target.files[0];
    if (file) {
      this.product[imageField] = file;
    }
  }

  // Update product information
  updateProduct(): void {
    if (!this.product.id) {
      alert('ID sản phẩm không hợp lệ!');
      return;
    }

    // Validate distinctive and category selections
    if (!this.product.distinctiveIds.length) {
      alert('Vui lòng chọn ít nhất một distinctive!');
      return;
    }

    if (!this.product.category) {
      alert('Vui lòng chọn một danh mục!');
      return;
    }

    // Prepare FormData for sending
    const formData = new FormData();
    formData.append('id', this.product.id);
    formData.append('name', this.product.name);
    formData.append('quantity', this.product.quantity.toString());
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);
    formData.append('status', this.product.status);
    formData.append('categoryId', this.product.category);
    formData.append('distinctiveIds', this.product.distinctiveIds); // Use distinctiveIds (single ID)


    // Append images if they exist
    if (this.product.image1) {
      formData.append('image1', this.product.image1);
    }

    if (this.product.image2) {
      formData.append('image2', this.product.image2);
    }

    this.productService.updateProduct(this.product.id, formData).subscribe({
      next: () => {
        alert('Cập nhật sản phẩm thành công!');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        alert('Có lỗi xảy ra khi cập nhật sản phẩm! ' + error.message);
      }
    });
  }


  // Handle distinctive selection change
  onDistinctiveChange(event: any): void {
    this.product.distinctiveIds = event.target.value; // Update the product's distinctiveId
  }
}
