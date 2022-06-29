import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import * as a from '../actions/app.action';

@Injectable()
export class AppEffects {
  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<a.Logout>(a.LOGOUT),
        tap((action) => {
          if (action.payload.isRedirect) {
            this.router.navigateByUrl('/');
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
