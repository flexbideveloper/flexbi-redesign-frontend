import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { CORE_CONSTANTS } from '../../constants';
import { UserAccountInfoFacadeService } from '../store/user-account-info/user-account-info.actions.facade.service';

@Injectable({ providedIn: 'root' })
export class StudentAccountInfoResolver implements Resolve<boolean> {
  constructor(private userAccountInfoFacadeService: UserAccountInfoFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const studentId = route.paramMap.get(CORE_CONSTANTS.ROUTE_STUDENT_UID_PARAM) || null;

    return studentId
      ? this.userAccountInfoFacadeService.getUserAccountInfo(studentId).pipe(map(() => true))
      : of(false);
  }
}
