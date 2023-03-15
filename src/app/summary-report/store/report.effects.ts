import { Injectable } from '@angular/core';
import * as fromAppStore from '@app/core/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  exhaustMap,
  withLatestFrom,
} from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { ReportService } from 'src/app/services/report.service';

import * as a from './report.actions';
import * as s from './report.selectors';

@Injectable()
export class ReportEffects {
  init$ = createEffect(() =>
    this.action$.pipe(
      ofType(a.init),
      withLatestFrom(this.store.select(s.selectSummaryLoading)),
      filter(([, isLoaded]) => !isLoaded),
      exhaustMap(() => {
        return [a.load(), a.loadMessage()];
      })
    )
  );

  load$ = createEffect(() =>
    this.action$.pipe(
      ofType(a.load,a.setOrgId),
      withLatestFrom(
        this.store.select(fromAppStore.selectUserInfo),
        this.store.select(fromAppStore.isAdvisor),
        this.store.select(fromAppStore.selectOrgLists),
        this.store.select(s.getOrgId)
      ),
      exhaustMap(([, { id_FkClientProfile }, isAdviser , orgLists , orgId]) =>
        this.reportService
          .getPageVisuals(isAdviser ? (orgId ? parseInt(orgId.toString()) : orgLists[0].orgId) : id_FkClientProfile)
          .pipe(
            map((data) => a.loadSuccess({ data })),
            catchError((err) => {
              return of(a.loadFail({ error: err }));
            })
          )
      )
    )
  );

  loadMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(a.loadMessage, a.sendMessageSuccess ,a.setOrgId),
      withLatestFrom(
        this.store.select(fromAppStore.selectUserInfo),
        this.store.select(fromAppStore.isAdvisor),
        this.store.select(fromAppStore.selectOrgLists),
        this.store.select(s.getOrgId)
      ),
      exhaustMap(([, { id_FkClientProfile }, isAdviser , orgLists , orgId]) =>
        this.messageApiService.getConversionsMessage(isAdviser ? (orgId ? parseInt(orgId.toString()) : orgLists[0].orgId) : id_FkClientProfile).pipe(
          map(({ data }) => a.loadMessageSuccess({ data })),
          catchError((err) => {
            return of(a.loadMessageFail({ error: err }));
          })
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(a.sendMessage),
      withLatestFrom(this.store.select(fromAppStore.selectUserInfo) ,   this.store.select(fromAppStore.isAdvisor),
      this.store.select(fromAppStore.selectOrgLists),
      this.store.select(s.getOrgId)),
      exhaustMap(([{ message }, { id, id_FkClientProfile } , isAdviser , orgLists , orgId ]) =>
        this.messageApiService
          .postConversion({
            id_FkClientProfile: isAdviser ? (orgId ? parseInt(orgId.toString()) : orgLists[0].orgId) : id_FkClientProfile,
            id_FkUserProfile: id,
            Message: message,
          })
          .pipe(
            map(({ data }) => a.sendMessageSuccess({ data })),
            catchError((err) => {
              return of(a.loadMessageFail({ error: err }));
            })
          )
      )
    )
  );


  loadUsers$ = createEffect(() =>
    this.action$.pipe(
      ofType(a.loadUsers,a.setOrgId),
      withLatestFrom(
        this.store.select(fromAppStore.selectUserInfo),
        this.store.select(fromAppStore.isAdvisor),
        this.store.select(fromAppStore.selectOrgLists),
        this.store.select(s.getOrgId)
      ),
      exhaustMap(([, { id_FkClientProfile }, isAdviser , orgLists , orgId]) =>
        this.authApiService.getUserLists(isAdviser ? (orgId ? parseInt(orgId.toString()) : orgLists[0].orgId) : id_FkClientProfile).pipe(
          map(({ data }) => a.loadUsersSuccess({ data })),
          catchError((err) => {
            return of(a.loadUsersFail({ error: err }));
          })
        )
      )
    )
  );

  loadVisuals$ = createEffect(() =>
  this.action$.pipe(
    ofType(a.loadVisuals,a.setOrgId),
    withLatestFrom(
      this.store.select(fromAppStore.selectUserInfo),
      this.store.select(fromAppStore.isAdvisor),
      this.store.select(fromAppStore.selectOrgLists),
      this.store.select(s.getOrgId)
    ),
    exhaustMap(([, { id_FkClientProfile }, isAdviser , orgLists , orgId]) =>
      this.authApiService.getVisualsList(isAdviser ? (orgId ? parseInt(orgId.toString()) : orgLists[0].orgId) : id_FkClientProfile).pipe(
        map(({ data }) => a.loadVisualsSuccess({ data })),
        catchError((err) => {
          return of(a.loadVisualsFail({ error: err }));
        })
      )
    )
  )
);


  clearStore$ = createEffect(() =>
    this.action$.pipe(
      ofType(fromAppStore.LOGOUT),
      map(() => a.clearState())
    )
  );

  constructor(
    private action$: Actions,
    private reportService: ReportService,
    private messageApiService: MessageService,
    private authApiService: AuthService,
    private store: Store
  ) {}
}
