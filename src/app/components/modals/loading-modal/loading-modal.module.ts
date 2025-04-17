import { NgModule } from '@angular/core';
import { LoadingModalComponent } from './loading-modal.component';
import { GenericModalModule } from '../generic-modal/generic-modal.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LoadingModalComponent
  ],
  exports: [
    LoadingModalComponent
  ],  
  imports: [
    SharedModule,
    GenericModalModule
  ]
})
export class LoadingModalModule { }
