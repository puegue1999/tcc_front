import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
    UrlTree,
} from '@angular/router';

// import { ErrorReportingService } from '../services/errorReproting/error-reporting.service';
import { PlatformModalsService } from '../services/modals/platform-modals.service';
import { SharedService } from '../shared/shared.service';

declare let Tos;

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private sharedService: SharedService,
        private router: Router,
        public platModalService: PlatformModalsService,
        // private errorHandler: ErrorReportingService
    ) { }

    // Verifica se o usuário está logado pelo token ativo
    isUserLoggedIn(state): boolean {
        if (!this.sharedService.fnUserHasToken() || !this.sharedService.fnUserHasValidToken()) {
            this.sharedService.deleteKeyLocalStorage('token');
            localStorage.setItem('returnUrl', state);
            Tos?.endSession();
            this.router.navigate(['']);
            this.sharedService.loggedIn.next(false);
            return false;
        }
        const user = this.sharedService.getUserSync();
        if (user) {
            const interval = setInterval(() => {
                try {
                    Tos?.startSession(user?.sub);
                    clearInterval(interval);
                } catch (error: any) {
                    this.errorHandler.handleError(error);
                    throw new Error(error.toString());
                }
            }, 100);
        }
        this.sharedService.loggedIn.next(true);
        return true;
    }

    // Verifica se está impersonificando algum user
    isUserImpersonated() {
        if (this.sharedService.fnIsThisUserImpersonated()) {
            this.sharedService.impersonating.next(true);
        }
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree {
        if (!this.isUserLoggedIn(state.url)) {
            return false;
        }

        this.isUserImpersonated();

        return true;
    }

    canLoad(route: Route, segments: UrlSegment[]): boolean {
        // let permissions: any = this.sharedService.getPermissions();
        const attemptedUrl = this.router.getCurrentNavigation()?.extractedUrl.toString();

        if (!this.isUserLoggedIn(attemptedUrl)) {
            return false;
        }

        const url: string = route?.path || '';
        const i18n = { ...this.sharedService.getTranslationsOf('Errors') };
        const message = i18n.permission_unauthorized;
        let urlString = '';

        segments.forEach((element) => {
            urlString += `/${element}`;
        });

        // if (!this.isUserLoggedIn(urlString)) {
        //   return false;
        // }

        if (url === '') {
            return false;
        }

        if (url === 'dashboard') {
            if (!this.sharedService.checkPermission('dashboard', 'list')) {
                this.sharedService.showUnauthorizedModal(message);
                this.sharedService.logOut();
                return false;
            }
        }

        if (url === 'disciplines') {
            if (!this.sharedService.checkPermission('disciplines', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'orgunits') {
            if (!this.sharedService.checkPermission('ou', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'permissions') {
            if (!this.sharedService.checkPermission('permissioning', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'settings') {
            if (!this.sharedService.checkAtLeastOnePermission('settings', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'users') {
            if (!this.sharedService.checkPermission('users', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'class-planner') {
            if (!this.sharedService.checkPermission('plannings', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'chromebook-dashboard-extension') {
            const permissions = [
                { name: 'chromebook_dashboard' }

            ];

            // Checa se há ao menos uma permissão
            const hasPermission = permissions.some((permission) => this.sharedService.checkPermission(permission.name, 'list'));

            if (!hasPermission) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'module-chrome-geolocation-reports') {
            const permissions = [
                { name: 'chromebook_dashboard' }
            ];

            // Checa se há ao menos uma permissão
            const hasPermission = permissions.some((permission) => this.sharedService.checkPermission(permission.name, 'list'));

            if (!hasPermission) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'reports') {
            // na página de relatórios para checar se o user pode acessar essa página
            // verificamos se há permissões nos relatórios existentes na página
            //  se houver ao menos uma permissão como true, a página aparece

            const permissions = [
                { name: 'report_center' }
            ];

            // Checa se há ao menos uma permissão
            const hasPermission = permissions.some((permission) => this.sharedService.checkPermission(permission.name, 'list'));

            if (!hasPermission) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'reports') {
            if (!this.sharedService.checkPermission('report_center', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }
        }

        if (url === 'sports') {
            if (!this.sharedService.checkPermission('sport', 'list')) {
                this.sharedService.showUnauthorizedModal(message, 'dashboard');
                return false;
            }

            return true;
        }

        return true;
    }
}
