import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_Routes } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(
    private http: HttpClient
  ) {}

  register() {
    return this.http.get(`${API_Routes.URL}/users/registerUser`);
    // const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/BA/municipios`;
    // return this.http.get<any[]>(url);
  }
}
