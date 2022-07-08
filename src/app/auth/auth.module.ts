import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { ReactiveFormsModule } from '@angular/forms';

import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from '../shared/shared.module';
import { PasswordControlPipe } from './sign-up/password-control.pipe';
import {
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { SocialAuthComponent } from './social-auth/social-auth.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PasswordControlPipe,
    SocialAuthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    SharedModule,
    SocialLoginModule,
  ],
})
export class AuthModule {}
