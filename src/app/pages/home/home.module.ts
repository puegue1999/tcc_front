import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HeadModule } from '../headbar/head.module';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HomeComponent],
  exports: [],
  imports: [HomeRoutingModule, HeadModule, CommonModule],
})
export class HomeModule {}
