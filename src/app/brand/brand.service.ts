import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Brand } from './brand.model';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private endpoint = 'brands'; // Đảm bảo rằng đường dẫn là 'api/brands'

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Tạo mới thương hiệu
  createBrand(brand: Brand): Observable<Brand> {
    const url = this.apiService.apiUrl(this.endpoint + '/add');
    return this.http.post<Brand>(url, brand).pipe(
      catchError(this.handleError<Brand>('createBrand'))
    );
  }

  // Lấy danh sách tất cả thương hiệu
  getAllBrands(): Observable<Brand[]> {
    const url = this.apiService.apiUrl(this.endpoint);  // Kiểm tra endpoint đúng
    return this.http.get<Brand[]>(url).pipe(
      catchError(this.handleError<Brand[]>('getAllBrands', []))
    );
  }
  

  // Lấy thông tin thương hiệu theo ID
  getBrandById(id: string): Observable<Brand> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.get<Brand>(url).pipe(
      catchError(this.handleError<Brand>(`getBrandById id=${id}`))
    );
  }

  // Cập nhật thông tin thương hiệu
  updateBrand(id: string, updatedBrand: Partial<Brand>): Observable<Brand> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.put<Brand>(url, updatedBrand).pipe(
      catchError(this.handleError<Brand>('updateBrand'))
    );
  }

  // Xóa thương hiệu theo ID
  deleteBrand(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteBrand', false)),
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
