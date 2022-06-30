import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({ providedIn: 'root' })
export class RedirectToDashboardCanActivate implements CanActivate {
  constructor(
    private authenticationService: AuthService,
    private navigationService: NavigationService
  ) {}
  canActivate(): Observable<boolean> {
    return this.authenticationService.isLoggedIn$.pipe(
      tap((loggedIn) => {
        if (loggedIn) {
          this.navigationService.redirectToDashboard();
        }
      }),
      map((loggedIn) => loggedIn)
    );
  }
}
