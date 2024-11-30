import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Để service có thể được sử dụng ở mọi nơi trong ứng dụng
})
export class StatisticsService {

  private apiUrl = 'http://localhost:8080/api/statistics/daily-sales'; // URL API

  constructor(private http: HttpClient) {}

  getDailySales(): Observable<any> {
    return this.http.get(this.apiUrl); // Gửi HTTP GET request đến API
  }
}
