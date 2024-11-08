import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl = 'http://localhost:8080/api/invoices/cancelled';


  private apiUrl = '/invoices';


  constructor(private http: HttpClient) {}

  getPendingInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
    
  }
  getCompletedInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/complete`);
  }
  getCancelledInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
  
}
