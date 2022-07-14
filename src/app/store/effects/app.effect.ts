import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as a from '../actions/app.action';
import * as fromStore from 'src/app/store';

@Injectable()
export class AppEffects {
  login$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.OnLogin>(a.ON_LOGIN),
        tap((action) => {
          this.router.navigateByUrl('dashboard/default');
        })
      );
    },
    { dispatch: false }
  );

  setUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.SetSocialUser>(a.SET_SOCIAL_USER),
        tap((action) => {
          this.router.navigateByUrl('dashboard/default');
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.Logout>(a.LOGOUT),
        tap((action) => {
          if (action.payload.isRedirect) {
            sessionStorage.removeItem('identity');
            this.router.navigateByUrl('/auth/sign');
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

  registerSocialUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.RegisterSocialUser>(a.REGISTER_SOCIAL_USER),
        map((action) => action.payload),

        switchMap(({ user }) => {
          return this.authService.registerUserByThirdParty(user).pipe(
            map((response) => {
              if (response.status === 200) {
                this.notification.success(response.message);
              } else {
                this.notification.error(response.message);
              }
              this.authService.setLoggedInUserDetails({
                UserId: response.data.id,
                UserName: response.data.UserName,
                CompanyName: response.data.CompanyName,
                Email: response.data.Email,
                UserRole: 'USER',
                UserRoleId: 100,
              });
              sessionStorage.setItem('identity', JSON.stringify(response.data));
              return this.store.dispatch(new a.SetSocialUser(response.data));
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService,
    private store: Store
  ) {}
}
