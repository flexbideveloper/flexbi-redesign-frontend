import { createAction, props } from '@ngrx/store';
import { IReportPageVisuals } from '../interfaces/report.interface';

export const init = createAction('[SUMMARY REPORT] Init Load Summy Report');

export const setOrgId = createAction(
  '[SUMMARY REPORT] set org id Summy Report',
  props<{ orgId: string }>()
);

export const load = createAction('[SUMMARY REPORT] Load Summy Report');

export const loadSuccess = createAction(
  '[SUMMARY REPORT] Load Summy Report Success',
  props<{ data: IReportPageVisuals }>()
);

export const loadFail = createAction(
  '[SUMMARY REPORT] Load Summy Report Fail',
  props<{ error?: any }>()
);

export const loadMessage = createAction(
  '[SUMMARY REPORT] Load  Message Summy Report'
);

export const loadMessageSuccess = createAction(
  '[SUMMARY REPORT] Load  Message Summy Report Success',
  props<{ data: any }>()
);

export const sendMessage = createAction(
  '[SUMMARY REPORT] Send  Message Report',
  props<{ message: string }>()
);

export const sendMessageSuccess = createAction(
  '[SUMMARY REPORT] Send  Message Success',
  props<{ data: any }>()
);

export const loadMessageFail = createAction(
  '[SUMMARY REPORT] Load  Message Summy Report Fail',
  props<{ error?: any }>()
);

export const loadUsers = createAction('[SUMMARY REPORT] Load  Users ');

export const loadUsersSuccess = createAction(
  '[SUMMARY REPORT] Load  Users  Success',
  props<{ data: any }>()
);

export const loadUsersFail = createAction(
  '[SUMMARY REPORT] Load  Users  Fail',
  props<{ error?: any }>()
);

export const loadVisuals = createAction('[SUMMARY REPORT] Load  Visuals');

export const loadVisualsSuccess = createAction(
  '[SUMMARY REPORT] Load  Visuals Success',
  props<{ data: any }>()
);


export const loadVisualsFail = createAction(
  '[SUMMARY REPORT] Load  Visuals Fail',
  props<{ error?: any }>()
);
export const clearState = createAction('[SUMMARY REPORT] ClearState');
