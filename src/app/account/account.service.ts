import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from './account.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts'; // API endpoint

  constructor(private http: HttpClient) {}

  // Tạo tài khoản mới và có thể đính kèm file
  createAccount(formData: FormData): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, formData).pipe(
      catchError(this.handleError<Account>('createAccount'))
    );
  }

  // Lấy tất cả các tài khoản
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl).pipe(
      catchError(this.handleError<Account[]>('getAllAccounts', []))
    );
  }

  // Lấy tài khoản theo ID
  getAccountById(id: string): Observable<Account> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Account>(url).pipe(
      catchError(this.handleError<Account>(`getAccountById id=${id}`))
    );
  }

  // Cập nhật tài khoản với tùy chọn đính kèm file
  updateAccount(updatedAccount: Account, imageFile?: File): Observable<Account> {
    const formData = this.createFormData(updatedAccount, imageFile);
    const url = `${this.apiUrl}/${updatedAccount.id}`;
    return this.http.put<Account>(url, formData).pipe(
      catchError(this.handleError<Account>('updateAccount'))
    );
  }

  // Xóa tài khoản theo ID
  deleteAccount(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteAccount', false)),
      map(() => true) // If successful, return true
    );
  }

  // Helper method to create FormData for account and image file
  private createFormData(account: Partial<Account>, imageFile?: File): FormData {
    const formData = new FormData();
    formData.append('id', account.id || '');
    formData.append('name', account.name || '');
    formData.append('password', account.password || '');
    formData.append('phone', account.phone || '');
    formData.append('email', account.email || '');
    formData.append('address', account.address || '');
    formData.append('admin', account.admin ? 'true' : 'false');
    formData.append('status', account.status ? 'true' : 'false');
    formData.append('confirm', account.confirm ? 'true' : 'false');

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    return formData;
  }

  // Handle HTTP operation failures
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
