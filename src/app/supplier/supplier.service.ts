import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Supplier } from './supplier.model';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private endpoint = 'suppliers';  // API endpoint for suppliers

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Get all suppliers
  getAllSuppliers(): Observable<Supplier[]> {
    const url = this.apiService.apiUrl(this.endpoint);
    return this.http.get<Supplier[]>(url).pipe(
      catchError(this.handleError<Supplier[]>('getAllSuppliers', []))
    );
  }

  // Get supplier by ID
  getSupplierById(id: string): Observable<Supplier> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.get<Supplier>(url).pipe(
      catchError(this.handleError<Supplier>(`getSupplierById id=${id}`))
    );
  }

  // Create a new supplier
  createSupplier(supplier: Supplier): Observable<Supplier> {
    const url = this.apiService.apiUrl(this.endpoint + '/add');
    return this.http.post<Supplier>(url, supplier).pipe(
      catchError(this.handleError<Supplier>('createSupplier'))
    );
  }

  // Update an existing supplier
  updateSupplier(id: string, updatedSupplier: Partial<Supplier>): Observable<Supplier> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.put<Supplier>(url, updatedSupplier).pipe(
      catchError(this.handleError<Supplier>('updateSupplier'))
    );
  }

  // Delete a supplier
  deleteSupplier(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteSupplier', false)),
      map(() => true)
    );
  }

  // Error handler for API calls
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
