import { Component, OnInit } from '@angular/core';
import { BrandService } from '../brand.service';
import { Brand } from '../brand.model';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  displayedBrands: Brand[] = [];
  errorMessage: string | null = null;

  totalBrands: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  startDisplay: number = 0;
  endDisplay: number = 0;

  constructor(private brandService: BrandService, private router: Router,  private apiService: ApiService, private http: HttpClient) {}
  private endpoint = 'brands';
  ngOnInit(): void {
    this.loadBrands();
  }

  // // Lấy danh sách tất cả thương hiệu
  // getBrands(): void {
  //   this.brandService.getAllBrands().subscribe(
  //     (brands) => {
  //       this.brands = brands;
  //       console.log(brands)
  //     },
  //     (error) => {
  //       console.error('Lỗi khi lấy danh sách thương hiệu:', error);
  //     }
  //   );
  // }
  loadBrands(): void {
    this.brandService.getAllBrands().subscribe(
      (brands) => {
        this.brands = brands;
        console.log(brands)
        this.totalBrands = this.brands.length;
        this.totalPages = Math.ceil(this.totalBrands / this.pageSize);
        this.updateDisplayedBrands();
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading brands:', error);
        this.errorMessage = 'Lỗi khi tải thương hiệu: ' + error.message;
      }
    );
  }
  updateDisplayedBrands(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalBrands);
    this.displayedBrands = this.brands.slice(startIndex, endIndex);

    // Tạo danh sách số trang
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Cập nhật start và end để hiển thị đúng số lượng
    this.startDisplay = startIndex + 1;
    this.endDisplay = endIndex;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedBrands();
  }


  // Xóa thương hiệu
  deleteBrand(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      this.brandService.deleteBrand(id).subscribe(
        () => {
          console.log('Thương hiệu đã được xóa');
          this.loadBrands();  // Cập nhật lại danh sách sau khi xóa
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
