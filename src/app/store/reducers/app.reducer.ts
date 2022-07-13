import { UserDetail, LoginResponse } from 'src/app/interfaces/auth.interface';
import * as fromApp from 'src/app/store/actions/app.action';
export interface AppState {
  user: any;
  accessToken: LoginResponse['token'];
  // refreshToken?: LoginResponse['refresh_token'];
  userDetail?: UserDetail;
  isCaptchSignIn: boolean;
  isCaptchSignUp: boolean;
}

export const initialState: AppState = {
  user: null,
  accessToken: '',
  userDetail:
    sessionStorage.getItem('identity') ||
    JSON.parse(sessionStorage.getItem('identity')) ||
    null,
  isCaptchSignIn: false,
  isCaptchSignUp: false,
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
    case fromApp.SET_SOCIAL_USER: {
      return {
        ...state,
        userDetail: action.payload,
      };
    }
    case fromApp.REMOVE_USER: {
      return {
        ...initialState,
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
