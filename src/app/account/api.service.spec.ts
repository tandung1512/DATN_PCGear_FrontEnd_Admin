import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/accounts'; // Địa chỉ API

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Thêm token xác thực nếu cần
      // 'Authorization': `Bearer ${yourToken}`
    })
  };

  constructor(private http: HttpClient) {}

  // Lấy tất cả tài khoản
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl, this.httpOptions);
  }

  // Lấy một tài khoản dựa vào ID
  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // Tạo một tài khoản mới
  createAccount(account: Omit<Account, 'id'>): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account, this.httpOptions);
  }

  // Cập nhật một tài khoản đã có
  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${account.id}`, account, this.httpOptions);
  }

  // Xóa một tài khoản dựa vào ID
  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}
