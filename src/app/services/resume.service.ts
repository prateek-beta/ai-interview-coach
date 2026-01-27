import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private apiUrl = "/api/resume/upload"; // proxy will forward to backend

  constructor(private http: HttpClient) {}

  uploadResume(formData: FormData) {
  const token = localStorage.getItem("token");

  return this.http.post(this.apiUrl, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
}
