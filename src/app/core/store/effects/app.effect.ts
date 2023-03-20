import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as a from '../actions/app.action';
import * as fromStore from '@app/core/store';
import { NavigationService } from 'src/app/services/navigation.service';

@Injectable()
export class AppEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<a.OnLogin>(a.ON_LOGIN),
      // tap(({payload}) => {
      //   if(payload.planData[0].IsActive){
      //     this.router.navigateByUrl('summaryreport');
      //   }else{
      //     this.router.navigateByUrl('subscriptions');
      //   }
      // })
      map(({ payload }) => {
        this.navigationService.redirectToDashboard();
        return new a.OnLoginSuccess({ userDetail: payload });
      })
    );
  });

  setUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<a.SetSocialUser>(a.SET_SOCIAL_USER),

      map(({ payload }) => {
        this.navigationService.redirectToDashboard();
        return new a.OnLoginSuccess({ userDetail: payload.userDetail });
      })
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.Logout>(a.LOGOUT),
        tap((action) => {
          if (action.payload.isRedirect) {
            sessionStorage.removeItem('identity');
            sessionStorage.removeItem('BearerToken');
            localStorage.removeItem('loggedInUserDetails');
            this.router.navigateByUrl('auth/sign-in');
          }
        })
      );
    },
    { dispatch: false }
  );

  signUp$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.onSignUp>(a.SIGN_UP_REQUEST),
        map((action) => action.payload),

        switchMap(({ form }) => {
          return this.authService.signUp(form).pipe(
            map((response) => {
              if (response.status === 200) {
                this.notification.success(response.message);
                this.router.navigateByUrl('auth/sign-in');
              } else {
                this.notification.error(response.message);
              }
              return new a.SignUpSuccess(response);
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  requestPassword$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.RequestPassword>(a.REQUEST_PASSWORRD),
        map((action) => action.payload),

        switchMap(({ emailId }) => {
          return this.authService.requestPasswordChange(emailId).pipe(
            map((response) => {
              if (response.status === 200) {
                this.notification.success(response.message);
              } else {
                this.notification.error(response.message);
              }
              return new a.SignUpSuccess(response);
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  setCompanyName$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.SetCompanyName>(a.SET_COMPANY_NAME),
        map((action) => action.payload),

        switchMap(({ CompanyName }) => {
          return of('').pipe(
            map((response) => {
              return this.store.dispatch(
                new a.SetCompanyNameSuccess({ CompanyName })
              );
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  
  registerSocialUserP$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<a.RegisterSocialUser>(a.REGISTER_SOCIAL_USER),
      map((action) => action.payload),
      switchMap(({ user }) => {
        return this.authService.registerUserByThirdParty(user);
      }),
      tap((response) => {
        if (response.status === 200) {
          this.notification.success(response.message);
        } else {
          this.notification.error(response.message);
        }
        this.authService.setLoggedInUserDetails({
          OrgId: response.data.id_FkClientProfile
            ? response.data.id_FkClientProfile
            : response.data.id,
          UserName: response.data.UserName,
          CompanyName: response.data.CompanyName,
          Email: response.data.Email,
          UserRole: 'USER',
          UserRoleId: 100,
          userProfileId: response.data.id
            ? response.data.id
            : response.data.id_FkClientProfile
            ? response.data.id_FkClientProfile
            : ''
        });
        sessionStorage.setItem('BearerToken', JSON.stringify(response.token));
        sessionStorage.setItem('identity', JSON.stringify(response.data));
      }),
      map((response) => new a.OnLogin(response))
    );
  });

  loadAuthSetting$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<a.LoadAuthSetting>(a.LOAD_AUTH_SETTING),
      switchMap(() => {
        return this.authService
          .allSettings()
          .pipe(
            map(
              (response) =>
                new a.LoadAuthSettingSuccess({ authSetting: response })
            )
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
    private store: Store,
    private navigationService:NavigationService
  ) {}
}
