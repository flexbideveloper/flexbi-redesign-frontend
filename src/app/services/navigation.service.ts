import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import * as s from 'src/app/store/selectors';
import { UserDetail } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];

  constructor(private store: Store, protected router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  redirectToDashboard(): void {
    this.store
      .select(s.getUserDetails)
      .pipe(take(1))
      .subscribe((userToken) => {
        this.getDefaultRedirectPage(userToken, true);
      });
  }

  getDefaultRedirectPage(
    userToken: UserDetail,
    withRedirect?: boolean
  ): string {
    if (!userToken) {
      return '';
    }

    let redirectTo = 'subscriptions';

    if (withRedirect) {
      this.router.navigateByUrl(redirectTo);
    }

    return redirectTo;
  }
}
