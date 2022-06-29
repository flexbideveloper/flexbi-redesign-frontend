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
  // refreshToken: '',
  userDetail: null,
};

export function reducer(
  state = initialState,
  action: fromApp.AppAction
): AppState {
  switch (action.type) {
    case fromApp.ON_LOGIN: {
      return {
        ...state,
        accessToken: action.payload.AuthToken,
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
