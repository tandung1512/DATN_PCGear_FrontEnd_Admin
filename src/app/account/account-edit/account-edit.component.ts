import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../account.model';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
})
export class AccountEditComponent implements OnInit {
  account: Account | undefined; // Tài khoản hiện tại
  selectedImage: File | null = null; // Lưu file hình ảnh đã chọn
  errorMessage: string | null = null; // Biến lưu thông báo lỗi

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Lấy ID tài khoản từ URL
    if (id) {
      this.loadAccount(id); // Tải thông tin tài khoản
    }
  }

  loadAccount(id: string): void {
    this.accountService.getAccountById(id).subscribe(
      (account) => {
        this.account = account; // Gán dữ liệu tài khoản cho form
        this.errorMessage = null; // Đặt lại thông báo lỗi nếu thành công
      },
      (error) => {
        this.handleError('Lỗi khi tải tài khoản', error); // Xử lý lỗi
      }
    );
  }

  save(): void {
    if (this.account) {
      this.accountService.updateAccount(this.account, this.selectedImage).subscribe(
        () => {
          this.router.navigate(['/accounts']); // Điều hướng về danh sách tài khoản sau khi lưu thành công
          this.errorMessage = null; // Đặt lại thông báo lỗi nếu thành công
        },
        (error) => {
          this.handleError('Lỗi khi lưu tài khoản', error); // Xử lý lỗi khi lưu
        }
      );
    }
  }

  // Xử lý việc chọn file hình ảnh
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0]; // Gán file hình ảnh đã chọn

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.account) {
          this.account.image = e.target.result; // Cập nhật hình ảnh tài khoản cho xem trước
        }
      };
      reader.readAsDataURL(this.selectedImage); // Chuyển đổi file thành base64 để xem trước
    }
  }

  // Hàm xử lý lỗi chung
  private handleError(action: string, error: any): void {
    console.error(`${action}:`, error); // Ghi lại lỗi vào console
    this.errorMessage = `${action}: ${error.message || 'Lỗi không rõ!'}`; // Thiết lập thông báo lỗi cho người dùng
  }
}  