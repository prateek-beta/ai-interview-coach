import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private apiUrl = "/api/resume/upload"; // proxy will forward to backend
  private resumeUrl = "/api/resume/my-resume";

  constructor(private http: HttpClient) { }

  uploadResume(formData: FormData) {
    const token = localStorage.getItem("token");

    return this.http.post(this.apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getResume() {
    const token = localStorage.getItem("token");
    return this.http.get(this.resumeUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
