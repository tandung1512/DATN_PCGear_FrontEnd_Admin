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
  errorMessage: string | null = null;

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
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading brands:', error);
        this.errorMessage = 'Failed to load brands: ' + error.message;
      }
    );
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
