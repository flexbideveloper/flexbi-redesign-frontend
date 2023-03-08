import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportInfoFacadeService } from 'src/app/summary-report/store/report-info.actions.facade.service';


@Injectable({ providedIn: 'root' })
export class ReportAppResolver implements Resolve<boolean> {
  constructor(private reportInfoFacadeService: ReportInfoFacadeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const studentId = route.paramMap.get('id') || null;

    return studentId
      ? this.reportInfoFacadeService.getReportAppInfo(studentId).pipe(map(() => true))
      : of(false);
  }
}
