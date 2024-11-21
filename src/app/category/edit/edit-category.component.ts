import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Category } from '../category.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
})
export class EditCategoryComponent implements OnInit {
  category: Category = { id: '', name: '', description: '', isHot: false }; // Khởi tạo dữ liệu mặc định cho Category với trường isHot
  errorMessage = ''; // Lưu thông báo lỗi khi có lỗi xảy ra

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id'); // Lấy id từ route
    if (categoryId) {
      this.loadCategory(categoryId);
    } else {
      this.errorMessage = 'ID không tồn tại';
    }
  }

  loadCategory(categoryId: string): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (data) => (this.category = data),
      error: (error) => {
        console.error('Lỗi khi tải thông tin danh mục:', error);
        this.errorMessage = 'Không thể tải thông tin danh mục';
      },
    });
  }

  updateCategory(): void {
    if (this.isValidCategory(this.category)) {
      this.categoryService.updateCategory(this.category).subscribe({
        next: () => {
          console.log('Cập nhật danh mục thành công');
          this.router.navigate(['/categories']); // Điều hướng về trang danh sách categories sau khi cập nhật thành công
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật danh mục:', error);
          this.errorMessage = 'Cập nhật danh mục thất bại. Hãy thử lại sau!';
        },
      });
    } else {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin danh mục';
    }
  }

  // Hàm kiểm tra tính hợp lệ của dữ liệu đầu vào
  private isValidCategory(category: Category): boolean {
    return !!(category.id && category.name && category.name.length >= 3);
  }
}
