import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
})
export class AccountCreateComponent implements OnInit {
  id: string = '';
  name: string = '';
  password: string = '';
  phone: string = '';
  email: string = '';
  // address: string = '';
  admin: boolean = false;
  status: boolean = true;
  confirm: boolean = true;

  selectedImage: File | null = null;
  errorMessage: string | null = null;

  // Các thuộc tính để theo dõi trạng thái "touched" của các trường
  idTouched: boolean = false;
  nameTouched: boolean = false;
  passwordTouched: boolean = false;
  phoneTouched: boolean = false;
  emailTouched: boolean = false;
  // addressTouched: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    this.errorMessage = null;

    // Validate từng trường chi tiết
    if (!this.validateForm()) {
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      const formData = new FormData();
      this.prepareFormData(formData, hashedPassword);

      this.accountService.createAccount(formData).subscribe({
        next: () => {
          this.router.navigate(['/accounts']);
        },
        error: (err) => {
          console.error('Error occurred while creating account:', err);
          this.errorMessage = 'Không thể tạo tài khoản: ' + (err.error?.message || err.message);
        }
      });
    } catch (error) {
      this.errorMessage = 'Đã xảy ra lỗi khi mã hóa mật khẩu: ' + error;
      console.error('Hashing error:', error);
    }
  }

  private validateForm(): boolean {
    if (!this.id || !this.name || !this.password || !this.phone || !this.email ) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.';
      return false;
    }

    if (this.idTouched && !this.id) {
      this.errorMessage = 'ID không được để trống.';
      return false;
    }

    if (this.nameTouched && !this.name) {
      this.errorMessage = 'Tên không được để trống.';
      return false;
    }

    if (this.passwordTouched && this.password.length < 6) {
      this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
      return false;
    }

    if (this.emailTouched && !this.validateEmail(this.email)) {
      this.errorMessage = 'Email không hợp lệ.';
      return false;
    }

    if (this.phoneTouched && !this.validatePhone(this.phone)) {
      this.errorMessage = 'Số điện thoại không hợp lệ. Vui lòng nhập số có ít nhất 10 chữ số.';
      return false;
    }

    return true;
  }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10,}$/; // Số điện thoại hợp lệ phải có ít nhất 10 chữ số
    return phoneRegex.test(phone);
  }

  private prepareFormData(formData: FormData, hashedPassword: string): void {
    formData.append('id', this.id);
    formData.append('name', this.name);
    formData.append('password', hashedPassword);
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    // formData.append('address', this.address);
    formData.append('admin', this.admin.toString());
    formData.append('status', this.status.toString());
    formData.append('confirm', this.confirm.toString());

    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0];
    }
  }

  get imagePreviewUrl(): string {
    return this.selectedImage ? URL.createObjectURL(this.selectedImage) : '';
  }

  // Cập nhật các thuộc tính "touched" khi người dùng rời khỏi trường nhập liệu
  onIdBlur() {
    this.idTouched = true;
  }

  onNameBlur() {
    this.nameTouched = true;
  }

  onPasswordBlur() {
    this.passwordTouched = true;
  }

  onPhoneBlur() {
    this.phoneTouched = true;
  }

  onEmailBlur() {
    this.emailTouched = true;
  }

  // onAddressBlur() {
  //   this.addressTouched = true;
  // }
}
