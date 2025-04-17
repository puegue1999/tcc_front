import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
    { path: 'login', redirectTo: '', pathMatch: 'full' },
    {
        path: '',
        component: LoginComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(
        routes,
        {
            preloadingStrategy: PreloadAllModules
        }
    )],
    exports: [RouterModule]
})
export class AppRoutingModule { }
