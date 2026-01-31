import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = '/api/interview/guest';
  private intapiurl = '/api/interview/book';

  constructor(private http: HttpClient) { }

  scheduleInterview(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  bookLoggedInInterview(data: any) {
    const token = localStorage.getItem("token");
    return this.http.post(this.intapiurl, data ,{headers: {
        Authorization: `Bearer ${token}`
      }});
  }

}
