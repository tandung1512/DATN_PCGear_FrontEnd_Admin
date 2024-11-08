import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Distinctive } from './distinctive.model';
import { ApiService } from '../service/api.service';

@Injectable({
  providedIn: 'root',
})
export class DistinctiveService {
  private endpoint = 'distinctives'; // Ensure the endpoint is 'api/distinctives'

  constructor(private http: HttpClient, private apiService: ApiService) {}

  // Create a new distinctive
  createDistinctive(distinctive: Distinctive): Observable<Distinctive> {
    const url = this.apiService.apiUrl(this.endpoint + '/add');
    return this.http.post<Distinctive>(url, distinctive).pipe(
      catchError(this.handleError<Distinctive>('createDistinctive'))
    );
  }

  // Get all distinctives
  getAllDistinctives(): Observable<Distinctive[]> {
    const url = this.apiService.apiUrl(this.endpoint);  // Ensure the endpoint is correct
    return this.http.get<Distinctive[]>(url).pipe(
      catchError(this.handleError<Distinctive[]>('getAllDistinctives', []))
    );
  }

  // Get a distinctive by ID
  getDistinctiveById(id: string): Observable<Distinctive> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.get<Distinctive>(url).pipe(
      catchError(this.handleError<Distinctive>(`getDistinctiveById id=${id}`))
    );
  }

  // Update a distinctive by ID
  updateDistinctive(id: string, updatedDistinctive: Partial<Distinctive>): Observable<Distinctive> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.put<Distinctive>(url, updatedDistinctive).pipe(
      catchError(this.handleError<Distinctive>('updateDistinctive'))
    );
  }

  // Delete a distinctive by ID
  deleteDistinctive(id: string): Observable<boolean> {
    const url = `${this.apiService.apiUrl(this.endpoint)}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteDistinctive', false)),
      map(() => true)
    );
  }

  // Generic error handler method
  private handleError<T>(operation = 'operation', result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
