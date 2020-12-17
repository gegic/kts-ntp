import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginRegisterComponent} from './view/login-registration/login-register.component';
import {EnterEmailComponent} from './view/login-registration/login/enter-email/enter-email.component';
import {EnterPasswordComponent} from './view/login-registration/login/enter-password/enter-password.component';
import {AuthGuard} from './core/guards/auth/auth.guard';
import {RegisterEmailComponent} from './view/login-registration/registration/register-email/register-email.component';
import {RegisterNameComponent} from './view/login-registration/registration/register-name/register-name.component';
import {RegisterPasswordComponent} from './view/login-registration/registration/register-password/register-password.component';
import {RegisterSuccessComponent} from './view/login-registration/registration/register-success/register-success.component';
import {RegisterVerifyComponent} from './view/login-registration/registration/register-verify/register-verify.component';
import {MainViewComponent} from './view/main-view/main-view.component';
import {MapViewComponent} from './view/map-view/map-view.component';
import {CulturalOfferingAddComponent} from './view/cultural-offering-add/cultural-offering-add.component';

const routes: Routes = [
  { path: '', component: MainViewComponent, canActivate: [AuthGuard], children: [
      { path: '', component: MapViewComponent },
      { path: 'create-offering', component: CulturalOfferingAddComponent }
    ]},

  { path: 'login', component: LoginRegisterComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: EnterEmailComponent, data: { animation: 'EnterEmail'}},
      { path: 'password', component: EnterPasswordComponent, data: { animation: 'EnterPassword' }}
    ]
  },
  { path: 'register', component: LoginRegisterComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: RegisterEmailComponent, data: { animation: 'RegisterEmail' }},
      { path: 'name', component: RegisterNameComponent, data: { animation: 'RegisterName' }},
      { path: 'password', component: RegisterPasswordComponent, data: { animation: 'RegisterPassword' }},
      { path: 'success', component: RegisterSuccessComponent, data: { animation: 'RegisterSuccess' }}
    ]
  },
  { path: 'verify', component: LoginRegisterComponent, canActivate: [AuthGuard],
    children: [
      { path: ':id', component: RegisterVerifyComponent}
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }