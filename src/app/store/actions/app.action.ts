import { Action } from '@ngrx/store';
import {
  AdminLoginResponse,
  AdminUser,
  ChangePassword,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  UserDetail,
} from 'src/app/interfaces/auth.interface';

export const ON_LOGIN = '[App] On Login';
export const ON_LOGIN_ADMIN = '[App] On Login Admin';

export const SIGN_UP_REQUEST = '[Auth] Sign Up Request';
export const SIGN_UP_SUCCESS = '[Auth] Sign Up Success';

export const ON_LOGIN_SUCCESS = '[App] On Login Success';

export const LOGOUT = '[App] On Logout';

export const REQUEST_PASSWORRD = '[App] On Request Password';
export const REQUEST_PASSWORRD_SUCCESS = '[App] On Request Password Success';

export class onSignUp implements Action {
  readonly type = SIGN_UP_REQUEST;

  constructor(public payload: { form: SignUpRequest }) {}
}

export class SignUpSuccess implements Action {
  readonly type = SIGN_UP_SUCCESS;

  constructor(public response: SignUpResponse) {}
}
export class OnLogin implements Action {
  readonly type = ON_LOGIN;

  constructor(public payload: UserDetail) {}
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

export class RequestPassword implements Action {
  readonly type = REQUEST_PASSWORRD;

  constructor(public payload: { emailId: string }) {}
}
export class RequestPasswordSuccess implements Action {
  readonly type = REQUEST_PASSWORRD_SUCCESS;

  constructor(public payload: { obj: ChangePassword }) {}
}

// action types
export type AppAction =
  | OnLogin
  | OnLoginSuccess
  | Logout
  | onSignUp
  | SignUpSuccess;
