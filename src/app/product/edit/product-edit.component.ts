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
    image1: '',
    image2: '',
    category: '',
    distinctiveIds: '' // Changed to hold a single distinctive ID
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
          // Ensure that the distinctiveId is set correctly from the response
          if (this.product.distinctiveIds) {
            this.product.distinctiveIds = this.product.distinctiveIds; // If using a single ID
          }
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

    // Fetch the list of categories
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        alert('Không thể tải danh sách danh mục!');
      }
    });

    // Fetch the list of distinctives
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
      this.convertFileToBase64(file).then((base64) => {
        this.product[imageField] = base64;
      }).catch((error) => {
        console.error('Có lỗi xảy ra khi chuyển đổi ảnh', error);
      });
    }
  }

  // Convert a file to base64
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // Return base64 string
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read file as Data URL
    });
  }

  // Update product information
  updateProduct(): void {
    if (!this.product.id) {
      alert('ID sản phẩm không hợp lệ!');
      return;
    }

    // If there's no selected distinctiveId, alert the user
    if (!this.product.distinctiveIds) {
      alert('Vui lòng chọn một distinctive!');
      return;
    }

    // Ensure categoryId is selected
    if (!this.product.category) {
      alert('Vui lòng chọn một danh mục!');
      return;
    }

    // Prepare the FormData to send in the update request
    const formData = new FormData();
    formData.append('id', this.product.id);
    formData.append('name', this.product.name);
    formData.append('quantity', this.product.quantity.toString());
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);
    formData.append('status', this.product.status);
    formData.append('categoryId', this.product.category); // Make sure categoryId is appended
    formData.append('distinctiveIds', this.product.distinctiveIds); // Use distinctiveIds (single ID)

    // Append images if available
    if (this.product.image1) {
      formData.append('image1', this.product.image1); // If you have a new image
    }

    if (this.product.image2) {
      formData.append('image2', this.product.image2); // If you have a new image
    }

    // Send the update request with FormData
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
