import { UserDetail, LoginResponse, IOrganisation, IAuthTokenSetting } from 'src/app/interfaces/auth.interface';
import * as fromAppStore from '@app/core/store';

export interface AppState {
  data: UserDetail;
  isLoading : boolean,
  token: LoginResponse['token'];
  // refreshToken?: LoginResponse['refresh_token'];
  userDetail?: UserDetail;
  isCaptchSignIn: boolean;
  isCaptchSignUp: boolean;
  isAdvisor :boolean;
  orgData : IOrganisation[],
  authSetting : IAuthTokenSetting[]
}

export const initialState: AppState = {
  isLoading : false,
  data: null,
  token: '',
  userDetail:
    // (sessionStorage.getItem('identity') &&
    //   JSON.parse(sessionStorage.getItem('identity'))) ||
    null,
  isCaptchSignIn: false,
  isCaptchSignUp: false,
  isAdvisor :false,
  orgData: [],
  authSetting : []
};

export function reducer(
  state = initialState,
  action: fromAppStore.AppAction
): AppState {
  switch (action.type) {
    case fromAppStore.ON_LOGIN: {
      return {
        ...state,
        userDetail: action.payload.data,
      };
    }
    case fromAppStore.ON_LOGIN_SUCCESS: {
      const {userDetail} = action.payload
      return {
        ...state,
        // isLoading : false,
        ...userDetail
      };
    }
    case fromAppStore.SET_SOCIAL_USER: {
      const {userDetail} = action.payload
      return {
        ...state,
        ...userDetail
      };
    }
    case fromAppStore.REMOVE_USER: {
      return {
        ...initialState,
      };
    }
    case fromAppStore.LOGOUT: {
      return {
        ...initialState,
      };
    }
    case fromAppStore.SET_COMPANY_NAME_SUCCESS: {
      return {
        ...initialState,
        userDetail: {
          ...state.userDetail,
          CompanyName: action.payload.CompanyName,
        },
      };
    }
    case fromAppStore.LOAD_AUTH_SETTING_SUCCESS: {
      return {
        ...state,
        authSetting: action.payload.authSetting,
      };
    }
  }

  return state;
}
export const getAccessToken = (state: AppState): string => state.token;
export const getUserDetails = (state: AppState): UserDetail =>
  state?.data;
