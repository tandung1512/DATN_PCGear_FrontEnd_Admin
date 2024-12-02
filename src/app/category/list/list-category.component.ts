import { Component, OnInit } from '@angular/core';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import * as ExcelJS from 'exceljs';  // Import thư viện ExcelJS
import { saveAs } from 'file-saver';   // Import thư viện FileSaver để lưu file
import { jsPDF } from 'jspdf';         // Import thư viện jsPDF để tạo PDF

@Component({
  selector: 'app-category-list',
  templateUrl: './list-category.component.html',
})
export class ListCategoryComponent implements OnInit {
  categories: Category[] = [];
  displayedCategories: Category[] = [];
  errorMessage: string | null = null;

  totalCategories: number = 0;
  pageSize: number = 15; 
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  startDisplay: number = 0;
  endDisplay: number = 0;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        console.log(categories);  // Kiểm tra dữ liệu category trong console
        this.totalCategories = this.categories.length;
        this.totalPages = Math.ceil(this.totalCategories / this.pageSize);
        // Tính tổng số trang
        this.updateDisplayedCategories(); 
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Lỗi khi tải danh mục: ' + error.message;
      }
    );
  }

  updateDisplayedCategories(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;  // Sửa lại công thức tính startIndex
    const endIndex = Math.min(startIndex + this.pageSize, this.totalCategories);  // Đảm bảo không vượt quá số lượng category
  
    this.displayedCategories = this.categories.slice(startIndex, endIndex);  // Cập nhật danh sách sản phẩm cần hiển thị
  
    // Tạo danh sách số trang
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    // Cập nhật start và end để hiển thị đúng số lượng
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }
  
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedCategories();  // Cập nhật danh sách hiển thị khi chuyển trang
  }

  editCategory(id: string): void {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: string): void {
    const confirmDelete = confirm('Bạn muốn xoá danh mục này?');
    if (confirmDelete) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();  // Sau khi xóa, tải lại danh mục
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error deleting category:', error);
          this.errorMessage = 'Lỗi khi xoá danh mục: ' + error.message;
        }
      );
    }
  }

  addNewCategory(): void {
    this.router.navigate(['/categories/create']); // Chuyển hướng tới trang tạo category
  }

  // Xuất danh mục ra Excel
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Categories');
    
    // Đặt tiêu đề cho bảng
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Tên Danh Mục', key: 'name', width: 30 },
      { header: 'Mô Tả', key: 'description', width: 50 }
    ];

    // Thêm dữ liệu vào bảng
    this.displayedCategories.forEach(category => {
      worksheet.addRow({
        id: category.id,
        name: category.name,
        description: category.description
      });
    });

    // Lưu file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), 'Categories.xlsx');
    });
  }

  // Xuất danh mục ra PDF
  exportToPDF(): void {
    const doc = new jsPDF();

    // Lấy dữ liệu của danh mục (category)
    const tableData = this.categories.map((category) => [
      category.id,
      category.name,
      category.description, // Bạn có thể thêm thuộc tính khác nếu cần
    ]);

    // Header của bảng
    const headers = [['ID', 'Name', 'Description']]; // Các cột trong bảng

    // Thêm tiêu đề cho bảng
    doc.text('Category List', 10, 10);

    // Xuất bảng vào PDF
    (doc as any).autoTable({
      head: headers,
      body: tableData,
      startY: 20, // Định vị trí bắt đầu của bảng
    });

    // Lưu file PDF
    doc.save('Categories.pdf');
  }
}