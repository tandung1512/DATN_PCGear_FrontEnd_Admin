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
  // Khai báo CKEditor với các tính năng mở rộng
  public Editor = ClassicEditor;
  
  // Cấu hình CKEditor
  public editorConfig = {
    toolbar: [
      'bold',              // In đậm
      'italic',            // In nghiêng
      'underline',         // Gạch chân
      'strikethrough',     // Gạch bỏ
      'link',              // Thêm liên kết
      'bulletedList',      // Danh sách có dấu chấm
      'numberedList',      // Danh sách có số
      'blockQuote',        // Trích dẫn
      'imageUpload',       // Tải lên hình ảnh
      'insertTable',       // Chèn bảng
      'mediaEmbed',        // Nhúng video (YouTube, Vimeo, ...)
      'code',              // Chèn mã nguồn
      'fontSize',          // Kích thước chữ
      'fontColor',         // Màu chữ
      'fontBackgroundColor', // Màu nền chữ
      'alignment',         // Căn chỉnh (trái, phải, giữa)
      'indent',            // Thụt lề
      'outdent'            // Giảm thụt lề
    ],
    // Cấu hình các đặc điểm khác cho CKEditor (nếu cần)
    language: 'en',      // Ngôn ngữ mặc định
    image: {
      toolbar: [
        'imageTextAlternative', // Chỉnh sửa mô tả alt của hình ảnh
        'imageStyle:full',      // Kiểu hình ảnh đầy đủ
        'imageStyle:side',      // Hình ảnh ở bên cạnh
        'linkImage'             // Chèn liên kết cho hình ảnh
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',  // Chỉnh sửa cột
        'tableRow',     // Chỉnh sửa dòng
        'mergeTableCells' // Hợp nhất các ô trong bảng
      ]
    },
    removePlugins: ['ImageResize', 'EasyImage'], // Loại bỏ một số plugin không cần thiết (nếu muốn)
  };

  newProduct: Product = {
    id: '',
    name: '',
    quantity: 0,
    price: 0,
    description: '',
    status: '',
    image1: '',  // Dự định lưu trữ dưới dạng string (base64) hoặc File sau này
    image2: '',  // Dự định lưu trữ dưới dạng string (base64) hoặc File sau này
    category: '', // ID của danh mục (string)
    distinctiveIds: '' // ID của distinctive (string)
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
        alert('Failed to load categories.');
      }
    });

    // Fetch distinctives from API
    this.distinctiveService.getAllDistinctives().subscribe({
      next: (data) => {
        this.distinctives = data;
      },
      error: () => {
        alert('Failed to load distinctives.');
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
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.quantity || !this.newProduct.category || !this.newProduct.id) {
      alert('Please fill in all required fields, including category and ID!');
      return;
    }

    try {
      // Create FormData object to send product data
      const formData = new FormData();
      formData.append('id', this.newProduct.id);
      formData.append('name', this.newProduct.name);
      formData.append('quantity', this.newProduct.quantity.toString());
      formData.append('price', this.newProduct.price.toString());
      formData.append('description', this.newProduct.description);
      formData.append('status', this.newProduct.status);
      // Trước khi gửi request, chắc chắn rằng categoryId được append vào FormData
      formData.append('categoryId', this.newProduct.category); // category là ID của category đã chọn


      // Append images to FormData if they are File objects
      if (this.isFile(this.newProduct.image1)) {
        formData.append('image1', this.newProduct.image1);
      }

      if (this.isFile(this.newProduct.image2)) {
        formData.append('image2', this.newProduct.image2);
      }

      // Append the single distinctive ID (not an array anymore)
      if (this.newProduct.distinctiveIds) {
        formData.append('distinctiveIds', this.newProduct.distinctiveIds); // Single distinctive ID
      }

      // Send the FormData to create the product
      await this.productService.createProduct(formData).toPromise();
      alert('Product added successfully!');
      this.router.navigate(['/products']);
    } catch (error) {
      alert('An error occurred while adding the product.');
      console.error(error);
    }
  }

    // Validation method
    validateProduct(): boolean {
      if (!this.newProduct.id || this.newProduct.id.trim().length === 0) {
        alert('Product ID is required.');
        return false;
      }
      if (!this.newProduct.name || this.newProduct.name.trim().length < 3) {
        alert('Product name must be at least 3 characters long.');
        return false;
      }
      if (this.newProduct.quantity <= 0) {
        alert('Quantity must be greater than 0.');
        return false;
      }
      if (this.newProduct.price <= 0) {
        alert('Price must be greater than 0.');
        return false;
      }
      if (!this.newProduct.category) {
        alert('Category is required.');
        return false;
      }
      return true;
    }

  // Handle file change event for image1 and image2
  onFileChange(event: any, imageField: 'image1' | 'image2'): void {
    const file = event.target.files[0];
    if (file) {
      this.newProduct[imageField] = file;  // Store the file in image1 or image2
    }
  }

  // Handle change of distinctive selection (single distinctive)
  onDistinctiveChange(event: any): void {
    this.newProduct.distinctiveIds = event.target.value; // Update with selected distinctive ID
  }
}
