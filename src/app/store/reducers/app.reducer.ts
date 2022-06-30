import { UserDetail, LoginResponse } from 'src/app/interfaces/auth.interface';
import * as fromApp from 'src/app/store/actions/app.action';
export interface AppState {
  user: any;
  accessToken: LoginResponse['token'];
  // refreshToken?: LoginResponse['refresh_token'];
  userDetail?: UserDetail;
}

export const initialState: AppState = {
  user: null,
  accessToken: '',
  userDetail: JSON.parse(sessionStorage.getItem('identity')) || null,
};

export function reducer(
  state = initialState,
  action: fromApp.AppAction
): AppState {
  switch (action.type) {
    case fromApp.ON_LOGIN: {
      return {
        ...state,
        userDetail: action.payload,
      };
    }
    case fromApp.LOGOUT: {
      return {
        ...initialState,
      };
    }
  }

  return state;
}
export const getAccessToken = (state: AppState): string => state.accessToken;
export const getUserDetails = (state: AppState): UserDetail =>
  state?.userDetail;
