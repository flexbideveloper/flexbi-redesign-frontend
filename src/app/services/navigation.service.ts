import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import * as fromStore from '@app/core/store';
import { UserDetail } from '../interfaces/auth.interface';
import { PAGE_ROUTES } from './pages-routes.constant';

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
      .select(fromStore.getUserToken)
      .pipe(take(1))
      .subscribe(userToken => {
        this.getDefaultRedirectPage(userToken, true);
      });
  }

  getDefaultRedirectPage(userToken: string, withRedirect?: boolean): string {
    if (!userToken) {
      return '';
    }

    let redirectTo = PAGE_ROUTES.SUBSCRIPTIONS;

    if (withRedirect) {
      this.router.navigateByUrl(redirectTo);
    }

    return redirectTo;
  }
}
