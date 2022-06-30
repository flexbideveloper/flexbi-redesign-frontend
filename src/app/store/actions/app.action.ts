import { Action } from '@ngrx/store';
import {
  AdminLoginResponse,
  AdminUser,
  LoginResponse,
  UserDetail,
} from 'src/app/interfaces/auth.interface';

export const ON_LOGIN = '[App] On Login';
export const ON_LOGIN_ADMIN = '[App] On Login Admin';

export const ON_SIGN_UP = '[App] On Sign Up User';

export const ON_LOGIN_SUCCESS = '[App] On Login Success';

export const LOGOUT = '[App] On Logout';

export class OnLogin implements Action {
  readonly type = ON_LOGIN;

  constructor(public payload: UserDetail) {}
}

export class OnLoginAdmin implements Action {
  readonly type = ON_LOGIN_ADMIN;

  constructor(public payload: AdminLoginResponse) {}
}

export class OnLoginSuccess implements Action {
  readonly type = ON_LOGIN_SUCCESS;

  constructor(
    public payload: {
      userDetail: LoginResponse;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;

  constructor(public payload: { isRedirect: boolean } = { isRedirect: true }) {}
}

// action types
export type AppAction = OnLogin | OnLoginSuccess | Logout;
