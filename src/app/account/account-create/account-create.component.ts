import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
})
export class AccountCreateComponent implements OnInit {
  accountForm: FormGroup; // FormGroup cho biểu mẫu
  selectedImage: File | null = null; // Để lưu file ảnh được chọn
  errorMessage: string | null = null; // Hiển thị lỗi

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    // Khởi tạo form với FormBuilder
    this.accountForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      admin: [false],
      status: [false],
      confirm: [false],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = null; // Reset error message mỗi khi gửi form
    if (this.accountForm.invalid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.'; // Thông báo lỗi cho form không hợp lệ
      return;
    }

    // Tạo một đối tượng FormData để chứa thông tin tài khoản và ảnh đã chọn
    const formData = new FormData();
    const formValues = this.accountForm.value;

    // Thêm dữ liệu tài khoản vào FormData
    formData.append('id', formValues.id);
    formData.append('name', formValues.name);
    formData.append('password', formValues.password);
    formData.append('phone', formValues.phone);
    formData.append('email', formValues.email);
    formData.append('address', formValues.address);
    formData.append('admin', formValues.admin.toString());
    formData.append('status', formValues.status.toString());
    formData.append('confirm', formValues.confirm.toString());

    // Thêm ảnh đã chọn vào FormData nếu có
    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

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
