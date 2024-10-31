import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

   apiUrl(path: string) {
    return `http://localhost:8080/api/${path}`;
  }
}
