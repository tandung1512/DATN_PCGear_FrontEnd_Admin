import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from './product.model';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private endpoint = 'products'; // Đảm bảo endpoint là 'api/products'

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Tạo một sản phẩm mới
  createProduct(product: Product): Observable<Product> {
    const url = this.apiService.apiUrl(this.endpoint + '/add'); // Đảm bảo URL chính xác
    return this.http.post<Product>(url, product).pipe(
      catchError(this.handleError<Product>('createProduct'))
    );
  }

  // Lấy tất cả sản phẩm
  getAllProducts(): Observable<Product[]> {
    const url = this.apiService.apiUrl(this.endpoint); // Đảm bảo URL chính xác
    return this.http.get<Product[]>(url).pipe(
      catchError(this.handleError<Product[]>('getAllProducts', []))
    );
  }

  // Lấy sản phẩm theo ID
  getProductById(id: string): Observable<Product> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`; // Đảm bảo URL chính xác
    return this.http.get<Product>(url).pipe(
      catchError(this.handleError<Product>(`getProductById id=${id}`))
    );
  }

  // Cập nhật sản phẩm theo ID
  updateProduct(id: string, updatedProduct: Partial<Product>): Observable<Product> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`; // Đảm bảo URL chính xác
    return this.http.put<Product>(url, updatedProduct).pipe(
      catchError(this.handleError<Product>('updateProduct'))
    );
  }

  // Xóa sản phẩm theo ID
  deleteProduct(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`; // Đảm bảo URL chính xác
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteProduct', false)),
      map(() => true) // Chuyển đổi từ void thành true (để xác nhận đã xóa)
    );
  }

  // Hàm xử lý lỗi chung
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // In lỗi ra console
      return of(result as T); // Trả về kết quả mặc định (hoặc kết quả trống nếu không có)
    };
  }
}