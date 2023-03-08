import { Injectable } from '@angular/core';

import * as fromAppStore from '@app/core/store';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { IReportPageVisuals } from '../interfaces/report.interface';

import * as a  from './report.actions';
import { IReportState } from './report.state';

@Injectable({ providedIn: 'root' })
export class ReportInfoFacadeService {
  constructor(private actions$: Actions, private store: Store<IReportState>) {}

  getReportAppInfo(id: string): Observable<any> {

    
    return of(true).pipe(
      take(1),
      switchMap(reportAppInfo => {
        if (reportAppInfo) {
          return of(reportAppInfo);
        } else {
          return forkJoin([
            of(true).pipe(
              tap(() => {
                this.store.dispatch( a.init());
              })
            ),
            this.actions$.pipe(
              ofType(a.loadSuccess),
              take(1),
              switchMap((data) => of(data))
            )
          ]).pipe(switchMap(([, reportAppData]) => of(reportAppData)));
        }
      })
    );
  }

}
