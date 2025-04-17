import { NgModule } from '@angular/core';
import { GenericModalComponent } from './generic-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    GenericModalComponent
  ],
  exports: [
    GenericModalComponent
  ],  
  imports: [
    SharedModule
  ]
})
export class GenericModalModule { }
