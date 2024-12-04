import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Để service có thể được sử dụng ở mọi nơi trong ứng dụng
})
export class StatisticsService {


  constructor(private http: HttpClient) {}


  getMonthlySales(month: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/statistics/monthly?month=${month}`);
  }

  getYearlySales(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/statistics/yearly`);
  }
}
