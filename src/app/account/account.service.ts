import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from './account.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private endpoint = 'accounts'; // Base API endpoint

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Tạo tài khoản mới, với khả năng đính kèm file ảnh
  createAccount(formData: FormData): Observable<Account> {
    return this.http.post<Account>(this.apiService.apiUrl(this.endpoint), formData).pipe(
      catchError(this.handleError<Account>('createAccount'))
    );
  }

  // Lấy tất cả tài khoản
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiService.apiUrl(this.endpoint)).pipe(
      catchError(this.handleError<Account[]>('getAllAccounts', []))
    );
  }

  // Lấy tài khoản theo ID
  getAccountById(id: string): Observable<Account> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.get<Account>(url).pipe(
      catchError(this.handleError<Account>(`getAccountById id=${id}`))
    );
  }

  // Cập nhật tài khoản với tùy chọn đính kèm file
  updateAccount(updatedAccount: Partial<Account>, imageFile?: File): Observable<Account> {
    const formData = this.createFormData(updatedAccount, imageFile);
    const url = `${this.apiService.apiUrl(this.endpoint)}/${updatedAccount.id}`;
    return this.http.put<Account>(url, formData).pipe(
      catchError(this.handleError<Account>('updateAccount'))
    );
  }

  // Xóa tài khoản theo ID
  deleteAccount(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteAccount', false)),
      map(() => true) // Trả về true nếu thành công
    );
  }

  // Helper method to create FormData for account and optional image file
  private createFormData(account: Partial<Account>, imageFile?: File): FormData {
    const formData = new FormData();
    formData.append('id', account.id || ''); // Thêm ID nếu có
    formData.append('name', account.name || ''); // Thêm tên
    formData.append('password', account.password || ''); // Thêm mật khẩu
    formData.append('phone', account.phone || ''); // Thêm số điện thoại
    formData.append('email', account.email || ''); // Thêm email
    formData.append('address', account.address || ''); // Thêm địa chỉ
    formData.append('admin', account.admin ? 'true' : 'false'); // Thêm quyền admin
    formData.append('status', account.status ? 'true' : 'false'); // Thêm trạng thái
    formData.append('confirm', account.confirm ? 'true' : 'false'); // Thêm xác nhận

    // Nếu có ảnh, thêm ảnh vào FormData
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name); // Thêm file hình ảnh
    }
    return formData; // Trả về FormData đã tạo
  }

  // Hàm xử lý lỗi chung cho tất cả yêu cầu HTTP
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // Log lỗi vào console
      return of(result as T); // Trả về giá trị an toàn
    };
  }
}
