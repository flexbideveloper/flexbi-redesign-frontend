import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ContentLayoutComponent } from './layouts/content/content-layout.component';
import { FullLayoutComponent } from './layouts/full/full-layout.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

import { effects, reducers } from 'src/app/store';

import * as $ from 'jquery';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './token.interceptor';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import {
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';

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
    auth: getClientIdRedirectURL(),
  });
}

function getClientIdRedirectURL() {
  if (JSON.parse(sessionStorage.getItem('MICRO')) !== null) {
    return {
      clientId: JSON.parse(sessionStorage.getItem('MICRO')).ClientId,
      redirectUri: JSON.parse(sessionStorage.getItem('MICRO')).RedirectURL,
    };
  } else {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
    setTimeout(() => {
      window.location.reload();
    }, 2000);

    return '';
  }
}

@NgModule({
  declarations: [AppComponent, FullLayoutComponent, ContentLayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDKXKdHQdtqgPVl2HI2RnUa_1bjCxRCQo4',
    }),
    PerfectScrollbarModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),

    EffectsModule.forRoot(effects),
    ToastrModule.forRoot({ timeOut: 7000 }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    // SocialLoginModule,
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: getGoogleProvider(),
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
  bootstrap: [AppComponent],
})
export class AppModule {}
