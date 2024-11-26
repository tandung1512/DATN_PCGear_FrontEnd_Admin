import { Component, OnInit } from '@angular/core';
import { BannerService } from '../banner.service';
import { Banner } from '../banner.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-banner-edit',
  templateUrl: './banner-edit.component.html',
})
export class BannerEditComponent implements OnInit {
  errorMessage: string | null = null; // Hiển thị lỗi
  selectedImg: File | null = null; // Ảnh
  banner: Banner | undefined; // Banner hiện tại
  bannerForm: FormGroup

  constructor(
    private bannerService: BannerService, 
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}


  
  ngOnInit(): void {
    const stt = this.route.snapshot.paramMap.get('id'); // Lấy STT banner từ URL
    console.log('STT from URL:', stt);
    if (stt) {
      this.loadBanner(Number(stt)); // Chuyển STT thành kiểu number
    }
  }

  loadBanner(stt: number): void {
    this.bannerService.getBannerById(stt).subscribe(
      (banner) => {
        this.banner = banner; // Gán dữ liệu banner cho form
        console.log(banner.img)
        this.errorMessage = null; // Đặt lại thông báo lỗi nếu thành công
      },
      (error) => {
        this.handleError('Failed to load banner', error); // Xử lý lỗi
      }
    );
  }

  save(): void {
    if (this.banner) {
      this.bannerService.updateBanner(this.banner, this.selectedImg).subscribe(
        () => {
          console.log("Cập nhật thành công")
          this.router.navigate(['/banners']); // Điều hướng về danh sách tài khoản sau khi lưu thành công
          console.log(this.banner)
          this.errorMessage = null; // Đặt lại thông báo lỗi nếu thành công
        },
        (error) => {
          this.handleError('Failed to save banner', error); // Xử lý lỗi khi lưu
        }
      );
    }
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImg = target.files[0]; // Lấy file ảnh
      console.log('Selected image:', this.selectedImg);
    }
  }

  get imgPreviewUrl(): string {
    return this.selectedImg ? URL.createObjectURL(this.selectedImg) : ''; // URL xem trước ảnh
  }

  private handleError(action: string, error: any): void {
    console.error(`${action}:`, error); // Ghi lại lỗi vào console
    this.errorMessage = `${action}: ${error.message || 'Unknown error'}`; // Thiết lập thông báo lỗi cho người dùng
  }
}
