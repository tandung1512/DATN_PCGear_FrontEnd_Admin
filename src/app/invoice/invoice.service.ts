import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = '/api/invoices';

  constructor(private http: HttpClient) {}

  getPendingInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }
}
