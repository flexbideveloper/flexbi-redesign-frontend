import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromApp from '../reducers/app.reducer';

export const getAccessToken = createSelector(
  fromFeature.getAppState,
  fromApp.getAccessToken
);

export const getUserDetails = createSelector(
  fromFeature.getAppState,
  fromApp.getUserDetails
);
