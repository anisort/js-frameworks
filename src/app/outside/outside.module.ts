import { NgModule } from '@angular/core';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {ConfirmEmailComponent} from './components/auth/confirm-email/confirm-email.component';
import {SharedModule} from '../shared/shared.module';
import {Router, RouterModule} from '@angular/router';
import {RequestResetPasswordComponent} from './components/auth/request-reset-password/request-reset-password.component';
import {ResetPasswordComponent} from './components/auth/reset-password/reset-password.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    RequestResetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class OutsideModule { }
