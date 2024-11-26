import { Component, OnInit } from '@angular/core';
import { BannerService } from '../banner.service';
import { Banner } from '../banner.model';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
})
export class BannerListComponent implements OnInit {
  banners: Banner[] = [];
  errorMessage: string | null = null;
  banner: { img: string; active: boolean; stt: number }[] = [];

  constructor(private bannerService: BannerService, private router: Router,  private apiService: ApiService, private http: HttpClient, private cdr: ChangeDetectorRef) {}
  private endpoint = 'banners';
  ngOnInit(): void {
    this.loadBanners();

  }


  selectedBanners: any[] = [];  // Mảng để lưu các banner được chọn

  // Kiểm tra xem có banner nào được chọn không
  hasSelectedBanners(): boolean {
    return this.selectedBanners.length > 0;
  }

  toggleSelection(banner: any): void {
    const index = this.selectedBanners.indexOf(banner);
    if (index === -1) {
      this.selectedBanners.push(banner);  // Thêm vào danh sách chọn
    } else {
      this.selectedBanners.splice(index, 1);  // Xóa khỏi danh sách chọn
    }
  }

  updateIsActiveStatus(): void {
    if (!this.banners || this.banners.length === 0) {
      console.error('Danh sách banners trống, không thể cập nhật.');
      return;
    }
    
    // Duyệt qua toàn bộ danh sách banner và cập nhật trạng thái isActive
    this.banners.forEach((banner) => {
      // Cập nhật trạng thái isActive dựa trên việc banner có được chọn hay không
      banner.active = this.selectedBanners.some((selected) => selected.stt === banner.stt);
      console.log(`Banner ID: ${banner.stt}, isActive: ${banner.active}`);
  
      this.bannerService.updateBannerStatus(banner.stt, banner.active).subscribe(
        () => {
          console.log(`Banner với ID ${banner.stt} đã cập nhật trạng thái isActive.`);
        },
        (error) => {
          console.error(`Lỗi khi cập nhật trạng thái banner ${banner.stt}:`, error);
        }
      );
    });
  }
  

  // Chuyển dữ liệu banner được chọn qua query params
  goToHomepage() {
    const params = this.selectedBanners
      .filter(banner => banner.img && banner.active) // Chỉ thêm các banner active
      .map((banner, index) => `img${index + 1}=${encodeURIComponent(banner.img)}`)
      .join('&');
  
    const fullUrl = `http://localhost:4300?${params}`;
    localStorage.setItem('banners', JSON.stringify(this.selectedBanners)); // Lưu lại danh sách
    window.location.href = fullUrl;
  }
  
  

  loadBanners(): void {
    this.bannerService.getAllBanners().subscribe(
      (banners) => {
        this.banners = banners;
        console.log(banners)
        this.errorMessage = null;
      },
      (error) => {
        console.error('Error loading banners:', error);
        this.errorMessage = 'Failed to load banners: ' + error.message;
      }
    );
  }


  deleteBanner(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      this.bannerService.deleteBanner(id).subscribe(
        () => {
          console.log('Banner đã được xóa');
          this.loadBanners();  // Cập nhật lại danh sách sau khi xóa
        },
        (error) => {
          console.error('Lỗi khi xóa banner:', error);
        }
      );
    }
  }

  // Chuyển đến trang sửa thương hiệu
  editBanner(id: number): void {
    this.router.navigate(['/banners/edit', id]);  // Điều hướng đến trang chỉnh sửa
  }
  
}
