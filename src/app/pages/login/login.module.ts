import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginComponent],
  exports: [],
  imports: [LoginRoutingModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class LoginModule {}
