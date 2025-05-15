import { NgModule } from '@angular/core';

import { HeadComponent } from './head.component';
import { HeadRoutingModule } from './head-routing.module';

@NgModule({
  declarations: [HeadComponent],
  exports: [HeadComponent],
  imports: [HeadRoutingModule]
})
export class HeadModule {}
