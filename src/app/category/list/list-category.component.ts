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
  errorMessage: string | null = null;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        console.log(categories);  // Kiểm tra dữ liệu category trong console
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories: ' + error.message;
      }
    );
  }

  editCategory(id: string): void {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
          this.errorMessage = null;
        },
        (error) => {
          console.error('Error deleting category:', error);
          this.errorMessage = 'Failed to delete category: ' + error.message;
        }
      );
    }
  }

  addNewCategory(): void {
    this.router.navigate(['/categories/create']); // Chuyển hướng tới trang tạo category
  }
}
