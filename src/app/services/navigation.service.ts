import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, take, withLatestFrom } from 'rxjs';
import * as fromStore from '@app/core/store';
import { IOrganisation, UserDetail } from '../interfaces/auth.interface';
import { PAGE_ROUTES } from './pages-routes.constant';
import { isAdvisor } from '@app/core/store';

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
    combineLatest(
      this.store.select(fromStore.getUserToken),
      this.store.select(fromStore.isAdvisor),
      this.store.select(fromStore.selectOrgLists)
    )
      .pipe(take(1))
      .subscribe(([userToken, isAdviser , orgLists]) => {
        this.getDefaultRedirectPage(userToken, isAdviser, orgLists , true);
      });
  }

  getDefaultRedirectPage(
    userToken: string,
    isAdviser: boolean,
    orgLists:IOrganisation[],
    withRedirect?: boolean
  ): string {
    if (!userToken) {
      return '';
    }
    let redirectTo;
    if (isAdviser && orgLists.length) {
      redirectTo = PAGE_ROUTES.SUMMARY_REPORT;
    } else {
      redirectTo = PAGE_ROUTES.SUBSCRIPTIONS;
    }

    if (withRedirect) {
      this.router.navigateByUrl(redirectTo);
    }

    return redirectTo;
  }
}
