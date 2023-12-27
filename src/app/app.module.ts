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

import { effects, getAuthSettings, reducers } from 'src/app/core/store';

import * as $ from 'jquery';
import {
  ActionReducer,
  MetaReducer,
  Store,
  StoreModule,
  USER_PROVIDED_META_REDUCERS,
} from '@ngrx/store';
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
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppState } from './core/store/reducers/app.reducer';
import { storeFreeze } from 'ngrx-store-freeze';
import { TabService } from './services/tab/tab.service';

export function localStorageSyncReducer(
  tabService: TabService
): MetaReducer<any> {
  return (reducer: ActionReducer<any>) => {
    return localStorageSync({
      keys: [
        {
          app: ['token', 'isAdvisor', 'orgData', 'planData', 'data'],
        },
      ],
      rehydrate: true,
      syncCondition: () => tabService.isTabActive(),
    })(reducer);
  };
}

export function sessionStorageSync(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({
    keys: [
      {
        app: ['token', 'isAdvisor', 'orgData', 'planData', 'data'],
      },
    ],
    storage: sessionStorage,
    rehydrate: true,
  })(reducer);
}
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];

export const metaReducersFactory = (
  tabService: TabService
): MetaReducer<any>[] => [localStorageSyncReducer(tabService)];

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
    return {
      clientId: '727c40bf-26ac-4ffc-94cf-632809e55280',
      redirectUri: 'https://flexbireport.com/',
    };
}

function getGoogleProvider() {
  return new GoogleLoginProvider(
    '919671716592-ube4p7h32n1idc13sri4ki3susugq4a3.apps.googleusercontent.com'
  );
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
    {
      provide: USER_PROVIDED_META_REDUCERS,
      deps: [TabService],
      useFactory: metaReducersFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private store:Store){
    const isAuthSetting$ = this.store.select(getAuthSettings);
    console.log(isAuthSetting$.subscribe(data => console.log(data)))
  }

  getData(){
    return {
      clientId: '727c40bf-26ac-4ffc-94cf-632809e55280',
      redirectUri: 'https://flexbireport.com/'
    };
  }
}
