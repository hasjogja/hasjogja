import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbxWE3s_JCD2besdx0fHrV9f-b_xN2DQ0Q419d3ju3st1pldqUc335gK984aauP0b_CC/exec'; // Ganti dengan API-mu

  constructor(private http: HttpClient) {
    console.log('HttpClient Injected:', !!http); // 🔍 Debugging
  }

  getProducts(page: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}
