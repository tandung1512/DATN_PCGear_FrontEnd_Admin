import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from './account.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/accounts'; // API endpoint

  constructor(private http: HttpClient) {}

  // Create a new account and return it
  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account).pipe(
      catchError(this.handleError<Account>('createAccount', account))
    );
  }

  // Read all accounts
  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl).pipe(
      catchError(this.handleError<Account[]>('getAllAccounts', []))
    );
  }

  // Read a single account by ID
  getAccountById(id: string): Observable<Account> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Account>(url).pipe(
      catchError(this.handleError<Account>(`getAccountById id=${id}`))
    );
  }

  // Update an existing account
  updateAccount(updatedAccount: Account): Observable<Account> {
    const url = `${this.apiUrl}/${updatedAccount.id}`;
    return this.http.put<Account>(url, updatedAccount).pipe(
      catchError(this.handleError<Account>('updateAccount'))
    );
  }

  // Delete an account by ID
  deleteAccount(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<boolean>('deleteAccount', false)),
      // If successful, return true
      map(() => true)
    );
  }

  // Handle HTTP operation failures
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // log to console instead
      return of(result as T); // Let the app keep running by returning an empty result.
    };
  }
}
