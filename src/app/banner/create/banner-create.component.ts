import { Component, OnInit } from '@angular/core';
import { BannerService } from '../banner.service';
import { Banner } from '../banner.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-banner-create',
  templateUrl: './banner-create.component.html',
})
export class BannerCreateComponent {
    errorMessage: string | null = null; // Hiển thị lỗi
    selectedImg: File | null = null; // Ảnh
    bannerForm: FormGroup;
  
    constructor(private bannerService: BannerService, private router: Router,private fb: FormBuilder,) 
    {
        this.bannerForm = this.fb.group({
            isActive: [true],
            link: [''],
            isBlank: [true],
          });
     }

  
     onSubmit(): void {
        this.errorMessage = null; // Reset error message mỗi khi gửi form
    
        const formValues = this.bannerForm.value;
    
        // Tạo một đối tượng FormData để chứa thông tin sản phẩm và ảnh đã chọn
        const formData = new FormData();
        console.log(formValues);
        this.prepareFormData(formData, formValues);
    
        // Gửi dữ liệu qua ProductService
        this.bannerService.createBanner(formData).subscribe({
          next: () => {
            this.router.navigate(['/banners']); // Điều hướng đến danh sách sản phẩm sau khi tạo thành công
          },
          error: (err) => {
            console.error('Error occurred while creating product:', err);
            this.errorMessage = 'Không thể thêm sản phẩm: ' + (err.error?.message || err.message); // Hiển thị lỗi
          }
        });
      }

      
    private prepareFormData(formData: FormData, formValues: any): void {
        // Thêm dữ liệu sản phẩm vào FormData
 
        formData.append('isActive', formValues.isActive.toString());
        formData.append('link', formValues.link);
        formData.append('isBlank', formValues.isBlank.toString());
    
        // Thêm ảnh đã chọn vào FormData nếu có
        if (this.selectedImg) {
          formData.append('img', this.selectedImg, this.selectedImg.name);
        }
      }
    
      onImageSelected(event: Event, imageField: 'img'): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          if (imageField === 'img') {
            this.selectedImg = target.files[0];
          } 
        }
      }

      get imgPreviewUrl(): string {
        return this.selectedImg ? URL.createObjectURL(this.selectedImg) : ''; // URL xem trước ảnh 1
      }
  
}
