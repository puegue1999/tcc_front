import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_Routes } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TranslateServiceLocale {
    constructor(
        private http: HttpClient,
    ) { }

    getTranslations(group: any, locale: any, query: any): Observable<any> {
        return this.http.get<any>(`${API_Routes.URL}/translations/?group=${group}&locale=${locale}&q=${query}`);
    }

    getGroups(): Observable<any> {
        return this.http.get<any>(`${API_Routes.URL}/translations/groups`);
    }

    getTranslationsFile(uri:any, locale: any): Observable<any> {
        const date = Date.now();
        return this.http.get<any>(`${uri}i18n/${locale}/full.json?v=${date}`);
    }

    patchTranslations(params: any): Observable<any> {
        return this.http.patch<any>(`${API_Routes.URL}/translations`, params);
    }
    patchUserLanguage(params: any): Observable<any> {
        return this.http.patch<any>(`${API_Routes.URL}/users/changeLanguage`, params);
    }
}
