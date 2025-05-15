import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PlatformModalsService } from '../services/modals/platform-modals.service';
import { TranslateServiceLocale } from '../components/translate/translate.service';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  public routerEvents$!: Observable<RouterEvent>;
  renderer: Renderer2;
  
  constructor(
    private rendererFactory: RendererFactory2,
    private router: Router,
    public platModalService: PlatformModalsService,
    private translateServiceLocale: TranslateServiceLocale,
  ) {
    this.onRouteChange();
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  onRouteChange() {
    this.routerEvents$ = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd));
  }

  getTranslationsFile(locale: any, reload?: any, callback?: any) {
    const uri = localStorage.getItem('gcsInfraPath');
    this.translateServiceLocale.getTranslationsFile(uri, locale)
        .subscribe({
            next: (file) => {
                localStorage.setItem('translations', JSON.stringify(file));

                setTimeout(() => {
                    location.reload();
                }, 1000);
            },
            error: (error) => {
                this.throwError('Error while trying to get translations file');
            }
        });

    this.setSelectedLanguage(locale);
  }

  setSelectedLanguage(locale: string) {
    localStorage.setItem('currentLanguage', locale);
  }

  getTranslationsOf(module: string) {
    let errorMessage: any;
    if (localStorage.getItem('translations') === null) {
        errorMessage = 'translations were not found in localStorage';
        return this.throwError(errorMessage);
    }
    const translations = JSON.parse(localStorage.getItem('translations') || '');
    const moduleTranslations = translations[module];
    errorMessage = `Translations for '${module}' module were not found`;
    return (translations && moduleTranslations)
        ? moduleTranslations
        : this.throwError(errorMessage);
  }

  throwError(message: string) {
    throw new Error(message);
  }

  fnUserHasToken(): boolean {
    return localStorage.getItem('token') !== null;
  }

  fnUserHasValidToken(): boolean {
    const tmpUser = this.getUserSync();
    // Check the expiration time (exp) in the payload
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (tmpUser.exp && tmpUser.exp < currentTimestamp) {
        return false;
    }
    return true;
  }

  getUserSync(): any {
    const data: any = localStorage.getItem('token');
    return jwtDecode(data);
  }


}
