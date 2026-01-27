import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AuthService {

  constructor(private http: HttpClient) {}

  register(data:any) {
    return this.http.post('/api/auth/register', data);
  }

  login(data:any) {
    return this.http.post('/api/auth/login', data);
  }

  saveToken(token:string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
  }
}
