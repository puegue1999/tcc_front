import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { HeadModule } from '../headbar/head.module';

@NgModule({
  declarations: [HomeComponent],
  exports: [],
  imports: [HomeRoutingModule, CommonModule, HeadModule],
})
export class HomeModule {}
