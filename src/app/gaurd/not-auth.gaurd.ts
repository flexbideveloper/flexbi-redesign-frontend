import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import * as s from 'src/app/store/selectors';
import { UserDetail } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(s.getUserDetails),
      take(1),
      map((user: UserDetail) => {
        if (!user) {
          return true;
        }

        this.router.navigate(['/subscriptions']);

        return false;
      })
    );
  }
}
