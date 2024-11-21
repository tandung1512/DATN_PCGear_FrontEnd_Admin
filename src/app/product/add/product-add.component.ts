import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { CategoryService } from 'src/app/category/category.service';
import { DistinctiveService } from 'src/app/distinctive/distinctive.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
})
export class ProductAddComponent implements OnInit {
  public Editor = ClassicEditor;  // CKEditor instance

  // CKEditor configuration
  public editorConfig = {
    toolbar: [
      'bold', 'italic', 'underline', 'strikethrough', 'link', 
      'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', 
      'insertTable', 'mediaEmbed', 'code', 'fontSize', 'fontColor', 
      'fontBackgroundColor', 'alignment', 'indent', 'outdent'
    ],
    language: 'en',
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side', 'linkImage']
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    removePlugins: ['ImageResize', 'EasyImage']
  };

  newProduct: Product = {
    id: '',
    name: '',
    quantity: 0,
    price: 0,
    description: '',
    status: '',
    isHot: false,
    image1: '',
    image2: '',
    category: '',
    distinctiveIds: ''
  };

  categories: { id: string, name: string }[] = [];
  distinctives: { id: string, name: string }[] = [];
  isSubmitted: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private distinctiveService: DistinctiveService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Fetch categories from API
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        alert('Lỗi khi tải danh mục.');
      }
    });

    // Fetch distinctives from API
    this.distinctiveService.getAllDistinctives().subscribe({
      next: (data) => {
        this.distinctives = data;
      },
      error: () => {
        alert('Lỗi khi tải đặc trưng.');
      }
    });
  }

  // Type guard to check if the input is a File
  private isFile(file: any): file is File {
    return file instanceof File;
  }

  // Add product using FormData and handle asynchronous operations
  async addProduct(): Promise<void> {
    this.isSubmitted = true;

    if (!this.validateProduct()) {
      return;  // Exit if validation fails
    }

    try {
      const formData = new FormData();
      formData.append('id', this.newProduct.id);
      formData.append('name', this.newProduct.name);
      formData.append('quantity', this.newProduct.quantity.toString());
      formData.append('price', this.newProduct.price.toString());
      formData.append('description', this.newProduct.description);
      formData.append('status', this.newProduct.status);
      formData.append('isHot', this.newProduct.isHot ? 'true' : 'false');
      formData.append('categoryId', this.newProduct.category);

      // Append images if they are files
      if (this.isFile(this.newProduct.image1)) {
        formData.append('image1', this.newProduct.image1);
      }

      if (this.isFile(this.newProduct.image2)) {
        formData.append('image2', this.newProduct.image2);
      }

      // Append the distinctive ID (single)
      if (this.newProduct.distinctiveIds) {
        formData.append('distinctiveIds', this.newProduct.distinctiveIds);
      }

      // Send the FormData to create the product
      await this.productService.createProduct(formData).toPromise();
      alert('Thêm sản phẩm thành công!');
      this.router.navigate(['/products']);
    } catch (error) {
      alert('Đã xảy ra lỗi khi thêm sản phẩm.');
      console.error(error);
    }
  }

  // Validation method for product fields
  validateProduct(): boolean {
    if (!this.newProduct.id || this.newProduct.id.trim().length === 0) {
      alert('ID không được để trống.');
      return false;
    }
    if (!this.newProduct.name || this.newProduct.name.trim().length < 3) {
      alert('Tên sản phẩm không được để trống và phải trên 3 kí tự.');
      return false;
    }
    if (this.newProduct.quantity <= 0) {
      alert('Số lượng phải lớn hơn 0.');
      return false;
    }
    if (this.newProduct.price <= 0) {
      alert('Giá phải lớn hơn 0.');
      return false;
    }
    if (!this.newProduct.category) {
      alert('Danh mục không được để trống.');
      return false;
    }
    return true;
  }

  // Handle file change for images
  onFileChange(event: any, imageField: 'image1' | 'image2'): void {
    const file = event.target.files[0];
    if (file) {
      this.newProduct[imageField] = file; // Store the file in image1 or image2
    }
  }

  // Handle distinctive change (single selection)
  onDistinctiveChange(event: any): void {
    this.newProduct.distinctiveIds = event.target.value; // Update with selected distinctive ID
  }
}
