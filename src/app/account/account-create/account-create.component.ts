import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs để mã hóa mật khẩu
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
})
export class AccountCreateComponent implements OnInit {
  // Khai báo các biến để lưu giá trị của các trường trong biểu mẫu
  id: string = '';
  name: string = '';
  password: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  admin: boolean = false;
  status: boolean = true;
  confirm: boolean = true;

  selectedImage: File | null = null; // Để lưu file ảnh được chọn
  errorMessage: string | null = null; // Hiển thị lỗi

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    this.errorMessage = null; // Reset error message mỗi khi gửi form

    // Kiểm tra tính hợp lệ của form
    if (
      !this.id || this.id === "" ||
      !this.name || this.name === "" ||
      !this.password || this.password === "" ||
      !this.phone || this.phone === "" ||
      !this.email || this.email === "" ||
      !this.address || this.address === ""
    ) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.'; // Thông báo lỗi khi form không hợp lệ
      return;
    }
    
    
    try {
      // Mã hóa mật khẩu bằng bcrypt trước khi gửi
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      // Tạo một đối tượng FormData để chứa thông tin tài khoản và ảnh đã chọn
      const formData = new FormData();
      this.prepareFormData(formData, hashedPassword);

      // Gửi dữ liệu qua AccountService
      this.accountService.createAccount(formData).subscribe({
        next: () => {
          this.router.navigate(['/accounts']); // Điều hướng đến danh sách tài khoản sau khi tạo thành công
        },
        error: (err) => {
          console.error('Error occurred while creating account:', err);
          this.errorMessage = 'Không thể tạo tài khoản: ' + (err.error?.message || err.message); // Hiển thị lỗi
        }
      });
    } catch (error) {
      this.errorMessage = 'Đã xảy ra lỗi khi mã hóa mật khẩu: ' + error; // Hiển thị lỗi cụ thể
      console.error('Hashing error:', error);
    }
  }

  private prepareFormData(formData: FormData, hashedPassword: string): void {
    // Thêm dữ liệu tài khoản vào FormData
    formData.append('id', this.id);
    formData.append('name', this.name);
    formData.append('password', hashedPassword); // Sử dụng mật khẩu đã mã hóa
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    formData.append('address', this.address);
    formData.append('admin', this.admin.toString());
    formData.append('status', this.status.toString());
    formData.append('confirm', this.confirm.toString());

    // Thêm ảnh đã chọn vào FormData nếu có
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0]; // Lưu file ảnh được chọn
    }
  }

  get imagePreviewUrl(): string {
    return this.selectedImage ? URL.createObjectURL(this.selectedImage) : ''; // Lấy URL xem trước ảnh
  }
}
