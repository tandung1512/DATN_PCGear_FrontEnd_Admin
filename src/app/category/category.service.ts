import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from './category.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private endpoint = 'categories'; // API endpoint cho Category

  constructor(private http: HttpClient, private apiService: ApiService) {}

  createCategory(category: Category): Observable<Category> {
    const url = this.apiService.apiUrl(this.endpoint + '/add');
    return this.http.post<Category>(url, category).pipe(
      catchError(this.handleError<Category>('createCategory'))
    );
  }

  // Lấy tất cả category
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiService.apiUrl(this.endpoint)).pipe(
      catchError(this.handleError<Category[]>('getAllCategories', []))
    );
  }

  // Lấy category theo ID
  getCategoryById(id: string): Observable<Category> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.get<Category>(url).pipe(
      catchError(this.handleError<Category>(`getCategoryById id=${id}`))
    );
  }

  // Cập nhật category
  updateCategory(category: Category): Observable<Category> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${category.id}`;
    return this.http.put<Category>(url, category).pipe(
      catchError(this.handleError<Category>('updateCategory'))
    );
  }

  // Xóa category theo ID
  deleteCategory(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteCategory', false)),
      map(() => true) // Trả về true nếu thành công
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
