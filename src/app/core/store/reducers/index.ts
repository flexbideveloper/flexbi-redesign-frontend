import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromApp from './app.reducer';

export interface AppState {
  app: fromApp.AppState;
}

export const reducers: ActionReducerMap<AppState> = {
  app: fromApp.reducer,
};

export const getAppState = createFeatureSelector<fromApp.AppState>('app');
