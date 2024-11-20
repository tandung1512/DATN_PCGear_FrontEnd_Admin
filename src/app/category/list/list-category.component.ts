import { Component, OnInit } from '@angular/core';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './list-category.component.html',
})
export class ListCategoryComponent implements OnInit {
  categories: Category[] = [];
  displayedCategories: Category[] = [];
  errorMessage: string | null = null;

  totalCategories: number = 0;
  pageSize: number = 10;
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
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalCategories);
    this.displayedCategories = this.categories.slice(startIndex, endIndex);

    // Tạo danh sách số trang
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Cập nhật start và end để hiển thị đúng số lượng
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedCategories();
  }

  editCategory(id: string): void {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: string): void {
    const confirmDelete = confirm('Bạn muốn xoá danh mục này?');
    if (confirmDelete) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
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
}
