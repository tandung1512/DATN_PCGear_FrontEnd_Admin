import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product.model';
import { Router } from '@angular/router';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  displayedProducts: Product[] = [];

  totalProducts: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  startDisplay: number = 0;
  endDisplay: number = 0;

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
        this.totalProducts = this.products.length;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
        this.updateDisplayedProducts();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Có lỗi xảy ra khi tải dữ liệu sản phẩm! ' + (error.message || error);
      }
    });
  }
  
  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalProducts);
    this.displayedProducts = this.products.slice(startIndex, endIndex);

    // Tạo danh sách số trang
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Cập nhật start và end để hiển thị đúng số lượng
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedProducts();
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
          this.router.navigate(['/products']).then(() => {
            // Tải lại trang sau khi điều hướng (reload)
            window.location.reload();
        });
          alert('Sản phẩm đã được xóa thành công!');
        },
        error: (error) => {
          alert('Có lỗi xảy ra khi xóa sản phẩm! ' + (error.message || error));
        }
      });
    }
  }

  
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
  
    // Đặt tiêu đề cho các cột
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Is Hot', key: 'isHot', width: 10 },
      { header: 'Status', key: 'status', width: 10 },  // Thêm cột trạng thái
     
    ];
  
    // Thêm tất cả dữ liệu vào bảng
    this.products.forEach((product) => {
      worksheet.addRow({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        isHot: product.isHot ? 'Yes' : 'No',
        status: product.status ? 'In stock' : 'Out of stock',  // Giả sử status là boolean
        
      });
    });
  
    // Lưu file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), 'Products.xlsx');
    });
  }
  

  exportToPDF(): void {
    const doc = new jsPDF();
  
    // Lấy dữ liệu của tất cả sản phẩm (product)
    const tableData = this.products.map((product) => [
      product.id,
      product.name,
      product.price,
      product.quantity,
      product.isHot ? 'Yes' : 'No',  // Hiển thị 'Yes' hoặc 'No' cho isHot
      product.status ? 'In stock' : 'Out of stock', // Hiển thị trạng thái
     
    ]);
  
    // Header của bảng
    const headers = [['ID', 'Name', 'Price', 'Quantity', 'Is Hot', 'Status']]; // Thêm cột trạng thái và nổi bật
  
    // Thêm tiêu đề cho bảng
    doc.text('Product List', 10, 10);
  
    // Xuất bảng vào PDF
    (doc as any).autoTable({
      head: headers,
      body: tableData,
      startY: 20, // Định vị trí bắt đầu của bảng
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
        halign: 'center', // Căn giữa các cột
        valign: 'middle', // Căn giữa các hàng
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },  // Cột trạng thái
       
      },
    });
  
    // Lưu file PDF
    doc.save('Products.pdf');
  }
  
  
}
