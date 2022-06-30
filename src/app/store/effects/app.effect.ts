import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
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
            this.router.navigateByUrl('auth/sign-in/user');
          }
        })
      );
    },
    { dispatch: false }
  );
  constructor(private actions$: Actions, private router: Router) {}
}
