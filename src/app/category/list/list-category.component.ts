import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
})
export class ListCategoryComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router // Inject Router ở đây
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Error loading categories:', error)
    });
  }
  
  editCategory(id: string): void {
    this.router.navigate([`/categories/edit/${id}`]); // Sử dụng this.router để điều hướng
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe(
      (success) => {
        if (success) {
          this.categories = this.categories.filter(cat => cat.id !== id);
        }
      },
      (error) => console.error('Error deleting category:', error)
    );
  }
}