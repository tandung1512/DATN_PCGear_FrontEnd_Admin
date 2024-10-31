import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpBackend, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
  private http: HttpClient;

  constructor(
    private apiService: ApiService, 
    private backend: HttpBackend, 
    private router: Router, 
    private cookieService: CookieService
  ) {
    this.http = new HttpClient(this.backend);
  }

  // Set the login status in localStorage
  setLoggedIn(value: boolean): void {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', value.toString());
  }

  // Getter for login status
  get isLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
  }

  // Login method
  login(id: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(this.apiService.apiUrl('auth/login'), {
      id,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      observe: 'response' // To get the full response, including headers
    }).pipe(
      map(response => {
        if (response.status === 200) {
          this.setLoggedIn(true); // Set logged-in status
          // Here, you could also store tokens or user info in localStorage if needed
        }
        return response; // Return the full response
      })
    );
  }

  // Logout method
  doLogout(): void {
    this.setLoggedIn(false);
    this.cookieService.deleteAll('/'); // Clear all cookies
    this.cookieService.deleteAll('/authentication/');
    this.router.navigate(['/authentication/login']); // Redirect to login
  }
}
