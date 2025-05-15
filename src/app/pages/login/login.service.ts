import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { API_Routes } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  update_localstorage: ReplaySubject<any> = new ReplaySubject(1);
  openModalResetPassword$ = new Subject<boolean>();
  openModalValidationCode$ = new Subject<boolean>();
  enableSendValidationCodeButton$ = new Subject<boolean>();
  restartCountdownValidatonCode$ = new Subject<boolean>();
  openModalUseTerms$ = new Subject<any>();
  openModalPolicyAndPrivacy$ = new Subject<any>();
  authObject$ = new Subject<string>();
  getPrivacyTerms$ = new Subject<any>();
  hasVLibrasActivated$ = new Subject<boolean>();
  hasUserWayActivated$ = new Subject<boolean>();
  isTranslationsUploaded$ = new Subject<boolean>();

  hasReturnUrlParam$ = new Subject<any>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _ngZone: NgZone
  ) {}

  isRedirectRoute() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        const route = this.route.snapshot.queryParams;
        if (Object.prototype.hasOwnProperty.call(route, 'returnUrl')) {
          this.router.navigateByUrl(route['returnUrl']);
        }
      });
    });
  }

  whoami(): Observable<any> {
    return this.http.get(`${API_Routes.URL}/whoami`);
  }

  login(params: any): Observable<any> {
    return this.http.post<any>(
      `${API_Routes.URL}/auth?provider=password`,
      params
    );
  }

  loginWithGoogle(params: any): Observable<any> {
    return this.http.post<any>(
      `${API_Routes.URL}/auth?provider=google`,
      params
    );
  }

  refreshTokenGoogle(): Observable<any> {
    const params = {};
    return this.http.post<any>(
      `${API_Routes.URL}/auth/refresh?provider=google`,
      params
    );
  }

  refreshTokenStandalone(): Observable<any> {
    const params = {};
    return this.http.post<any>(
      `${API_Routes.URL}/auth/refresh?provider=password`,
      params
    );
  }

  tokenInfoGoogle(token: any): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );
  }

  loginWithMicrosoft(params: any): Observable<any> {
    return this.http.post<any>(
      `${API_Routes.URL}/auth?provider=microsoft`,
      params
    );
  }

  resetPassword(email: any): Observable<any> {
    return this.http.post(`${API_Routes.URL}/auth/password/reset`, email);
  }

  validationToken(token: any): Observable<any> {
    return this.http.post(
      `${API_Routes.URL}/auth/password/validationToken`,
      token
    );
  }

  updatePassword(params: any): Observable<any> {
    return this.http.post(`${API_Routes.URL}/auth/password/update`, params);
  }

  getProfiles(): Observable<any> {
    return this.http.get<any>(`${API_Routes.URL}/auth/myRoles`);
  }

  changeProfile(role_external_id: any): Observable<any> {
    return this.http.post<any>(
      `${API_Routes.URL}/auth/myRoles/${role_external_id}`,
      ''
    );
  }

  setGoogleCredencials(response: any) {
    localStorage.setItem('googleAuthToken', JSON.stringify(response.token));
    localStorage.setItem(
      'googleAuthTokenPicker',
      JSON.stringify(response.token_picker)
    );
  }

  setWhoamiCredencials(data: {
    clientId: string;
    apiKey: string;
    appId: string;
    mail: string;
  }) {
    localStorage.setItem('clientId', JSON.stringify(data.clientId));
    localStorage.setItem('apiKey', JSON.stringify(data.apiKey));
    localStorage.setItem('appId', JSON.stringify(data.appId));
    localStorage.setItem('mail', JSON.stringify(data.mail));
  }
}
