import { Component, OnInit } from '@angular/core';
import { BrandService } from '../brand.service';
import { Brand } from '../brand.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private brandService: BrandService, private router: Router) {}

  ngOnInit(): void {
    this.getBrands();
  }

  // Lấy danh sách tất cả thương hiệu
  getBrands(): void {
    this.brandService.getAllBrands().subscribe(
      (brands) => {
        this.brands = brands;
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách thương hiệu:', error);
      }
    );
  }

  // Xóa thương hiệu
  deleteBrand(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      this.brandService.deleteBrand(id).subscribe(
        () => {
          console.log('Thương hiệu đã được xóa');
          this.getBrands();  // Cập nhật lại danh sách sau khi xóa
        },
        (error) => {
          console.error('Lỗi khi xóa thương hiệu:', error);
        }
      );
    }
  }

  // Chuyển đến trang sửa thương hiệu
  editBrand(id: string): void {
    this.router.navigate(['/brands/edit', id]);  // Điều hướng đến trang chỉnh sửa
  }
}
