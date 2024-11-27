import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
})
export class AddCategoryComponent {
  // Khai báo newCategory và gán kiểu dữ liệu
  newCategory: Category = { id: '', name: '', description: '', isHot: false };
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  addCategory(): void {
    if (this.newCategory.id && this.newCategory.name) {
      this.categoryService.createCategory(this.newCategory).subscribe(
        (data) => {
          console.log('Thêm danh mục thành công:', data);
          // Chuyển hướng về trang /categories sau khi thêm thành công
          this.router.navigate(['/categories']);
        },
        (error) => console.error('Lỗi khi thêm danh mục:', error)
      );
    } else {
      console.error('Category ID and Name are required.');
    }
  }
}
