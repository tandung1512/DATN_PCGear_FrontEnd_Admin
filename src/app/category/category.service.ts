import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from './category.model';
import { ApiService } from '../service/api.service';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private endpoint = 'categories'; // Đảm bảo rằng endpoint là 'api/categories'

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Tạo mới danh mục
  createCategory(category: Category): Observable<Category> {
    const url = this.apiService.apiUrl(this.endpoint + '/add');
    return this.http.post<Category>(url, category).pipe(
      catchError(this.handleError<Category>('createCategory'))
    );
  }

  // Lấy danh sách tất cả danh mục
  getAllCategories(): Observable<Category[]> {
    const url = this.apiService.apiUrl(this.endpoint);
    return this.http.get<Category[]>(url).pipe(
      catchError(this.handleError<Category[]>('getAllCategories', []))
    );
  }

  // Lấy thông tin danh mục theo ID
  getCategoryById(id: string): Observable<Category> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.get<Category>(url).pipe(
      catchError(this.handleError<Category>(`getCategoryById id=${id}`))
    );
  }

  // Cập nhật thông tin danh mục
  updateCategory(id: string, updatedCategory: Partial<Category>): Observable<Category> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.put<Category>(url, updatedCategory).pipe(
      catchError(this.handleError<Category>('updateCategory'))
    );
  }

  // Xóa danh mục theo ID
  deleteCategory(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteCategory', false)),
      map(() => true)
    );
  }

  // Hàm xử lý lỗi chung
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
