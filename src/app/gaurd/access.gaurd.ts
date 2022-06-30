import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  constructor(private authenticationService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.checkActivate();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkActivate();
  }

  private checkActivate(): Observable<boolean> {
    return this.authenticationService.isLoggedIn$;
  }
}
