import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as a from '../actions/app.action';

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

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.Logout>(a.LOGOUT),
        tap((action) => {
          if (action.payload.isRedirect) {
            sessionStorage.removeItem('identity');
            this.router.navigateByUrl('auth/auth/sign-in');
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

  constructor(
    private actions$: Actions,
    private router: Router,
    private notification: NotificationService,
    private authService: AuthService
  ) {}
}
