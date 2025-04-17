import { NgModule } from '@angular/core';
import { TranslateComponent } from './translate.component';
import { ModalConfirmationModule } from '../modal-confirmation/modal-confirmation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PermissionModule } from 'src/app/directives/permission/permission.module';



@NgModule({
  declarations: [
    TranslateComponent,
  ],
  exports: [
    TranslateComponent,
  ],   
  imports: [
    SharedModule,
    ModalConfirmationModule,
    PermissionModule
  ]
})
export class TranslateModule { }
