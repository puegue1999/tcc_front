import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: 'login', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    component: LoginComponent,
    title: 'TCC - Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'TCC - Registro',
  },
  {
    path: 'home',
    title: 'TCC',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
