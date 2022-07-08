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
// import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';

// dev
// export function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       clientId: '900f88be-3ea0-4d2f-9920-44c56d2568c3',
//       redirectUri: 'http://localhost:4200'
//     }
//   });
// }

// google client id - 551168695918-2mma1finpggr9h4d201pt9ltqu3o3gti.apps.googleusercontent.com
// google prod id - 339956603680-ffo0kh2f1o2ic03ntch921k4o4khu65o.apps.googleusercontent.com
// client prod id - 755158558855-94o61uq742fo63pqqee8dmpou9a9nej5.apps.googleusercontent.com

// prod
// export function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       clientId: 'be3cce45-f9dc-4b05-bc65-9b05ca7b9fd2',
//       redirectUri: 'https://pbiembeddedproject.centralindia.cloudapp.azure.com'
//     }
//   });
// }

// client prod
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'b0f88104-4f4b-4a83-acea-7e2d1df5bb42',
      redirectUri: 'https://flexbireport.com.au/',
    },
  });
}

function getClientIdRedirectURL() {
  if (JSON.parse(sessionStorage.getItem('MICRO')) !== null) {
    return {
      clientId: JSON.parse(sessionStorage.getItem('MICRO')).ClientId,
      redirectUri: JSON.parse(sessionStorage.getItem('MICRO')).RedirectURL,
    };
  } else {
    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
    return {
      clientId: '',
      redirectUri: '',
    };
  }
}

function getGoogleProvider() {
  if (JSON.parse(sessionStorage.getItem('GOOGLE')) !== null) {
    return new GoogleLoginProvider(
      JSON.parse(sessionStorage.getItem('GOOGLE')).ClientId
    );
  } else {
    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
    return '';
  }
}

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
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '919671716592-ube4p7h32n1idc13sri4ki3susugq4a3.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
  ],
})
export class AuthModule {}
