import { createSelector } from '@ngrx/store';
import { UserDetail } from 'src/app/interfaces/auth.interface';
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

export const getCaptchaSignIn = (state: fromApp.AppState): boolean =>
  state?.isCaptchSignIn;

export const selectSignInCaptch = createSelector(
  fromFeature.getAppState,
  getCaptchaSignIn
);
