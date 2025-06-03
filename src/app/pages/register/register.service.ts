import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_Routes } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${API_Routes.URL}/users/createUser`, data);
  }
}
