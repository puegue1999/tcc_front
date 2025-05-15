import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeadComponent } from './head.component';

const routes: Routes = [
  { path: '', component: HeadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeadRoutingModule { }