import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../service/api.service';
import { Banner } from './banner.model'; // Đảm bảo đã tạo model Banner
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private endpoint = 'banners'; // Địa chỉ API


  constructor(private http: HttpClient, private apiService: ApiService) { }

  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiService.apiUrl(this.endpoint));
  }

  getBannerById(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.apiService.apiUrl(this.endpoint)}/${id}`);
  }

  // Gửi yêu cầu POST để tạo banner với URL ảnh
  createBanner(formData: FormData): Observable<Banner> {
    return this.http.post<Banner>(this.apiService.apiUrl(this.endpoint), formData).pipe(
      catchError(this.handleError<Banner>('createBanner'))
    );
  }

  // Cập nhật tài khoản với tùy chọn đính kèm file
  updateBanner(updatedBanner: Partial<Banner>, selectedImg?: File): Observable<Banner> {
    const formData = this.prepareFormData(updatedBanner, selectedImg);
    const url = `${this.apiService.apiUrl(this.endpoint)}/${updatedBanner.stt}`;
    return this.http.put<Banner>(url, formData).pipe(
      catchError(this.handleError<Banner>('updateBanner'))
    );
  }

  private prepareFormData(banner: Partial<Banner>, selectedImg?: File): FormData {
    // Thêm dữ liệu sản phẩm vào FormData
    const formData = new FormData();
    formData.append('isActive', (banner.active !== undefined ? banner.active : false).toString());
    formData.append('link', banner.link || '');  // Nếu link không tồn tại, truyền giá trị mặc định là ''
    formData.append('isBlank', (banner.blank !== undefined ? banner.blank : false).toString());

    // Thêm ảnh đã chọn vào FormData nếu có
    if (selectedImg) {
      formData.append('img', selectedImg, selectedImg.name);
      console.log('Image added to FormData:', selectedImg.name);
    }
    return formData;
  }

  updateBannerStatus(stt: number, isActive: boolean): Observable<any> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${stt}`;
    return this.http.patch(url, { isActive }).pipe(
      catchError((error) => {
        console.error('Lỗi khi cập nhật trạng thái isActive:', error);
        return of(null);
      })
    );
  }


  // Xóa thương hiệu theo ID
  deleteBanner(id: number): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteBanner', false)),
      map(() => true)
    );
  }
  // Xử lý lỗi cho tất cả các yêu cầu HTTP
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
