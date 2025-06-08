import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { API_Routes } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.get(`${API_Routes.URL}/users/loginUser`, {
      params: data,
    });
  }
}
