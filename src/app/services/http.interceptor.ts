import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, delay, take } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { PlatformModalsService } from './modals/platform-modals.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  i18n: any = {};
  token: any;
  subscription$: Subscription[] = [];
  constructor(
    private sharedService: SharedService,
    public platformModalsService: PlatformModalsService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (localStorage.getItem('token') !== null) {
      this.token = localStorage.getItem('token');
    }

    if (this.token) {
      if (
        req?.url.includes('api/') &&
        !req?.url.includes('api/auth?provider')
      ) {
        const modReq = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + this.token,
          },
        });
        return (
          next
            .handle(modReq)
            // Intercepta Erro de requisição
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.getTranslation();
                // se erro for Token expirado desloga o usuário
                if (error.status == 403) {
                  if (error?.error?.status?.includes('Token is Expired')) {
                    // Se tiver algum outro modal aberto ele fecha, e depois abre o correto
                    // this.subscriptionModal();
                    this.sharedService.logOut();
                    // Dont allow any new observable
                    return new Observable<HttpEvent<any>>();
                  }
                }
                if (error.status == 401) {
                  if (error?.error?.error?.includes('sessão expirou')) {
                    // Se tiver algum outro modal aberto ele fecha, e depois abre o correto
                    // this.subscriptionModal();
                    this.sharedService.logOut();
                    // Dont allow any new observable
                    return new Observable<HttpEvent<any>>();
                  }
                }

                return throwError(error);
              })
            )
        );
      }
    }
    if (this.subscription$.length) {
      this.subscription$.forEach((element) => {
        element.unsubscribe();
      });
    }
    return next.handle(req);
  }

  // subscriptionModal(): void {
  //   let subscription = this.platformModalsService
  //     .getModalState('message')
  //     .pipe(delay(0), take(1))
  //     .subscribe((openedModal) => {
  //       if (openedModal) {
  //         this.platformModalsService.close('message');
  //       }
  //       this.sharedService.logOut();
  //     });

  //   this.subscription$.push(subscription);
  // }

  getTranslation(): void {
    this.i18n = { ...this.sharedService.getTranslationsOf('Errors') };
  }
}
