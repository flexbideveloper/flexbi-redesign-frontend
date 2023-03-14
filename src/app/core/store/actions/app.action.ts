import { Action } from '@ngrx/store';
import {
  AppSocialUser,
  ChangePassword,
  IAuthTokenSetting,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  UserDetail,
  UserLoginResp,
} from 'src/app/interfaces/auth.interface';

export const ON_LOGIN = '[App] On Login';
export const ON_LOGIN_ADMIN = '[App] On Login Admin';
export const LOAD_AUTH_SETTING = '[App] Load Auth Setting';
export const LOAD_AUTH_SETTING_SUCCESS = '[App] Load Auth Setting Success';

export const SIGN_UP_REQUEST = '[Auth] Sign Up Request';
export const SIGN_UP_SUCCESS = '[Auth] Sign Up Success';

export const ON_LOGIN_SUCCESS = '[App] On Login Success';

export const LOGOUT = '[App] On Logout';

export const REQUEST_PASSWORRD = '[App] On Request Password';
export const REQUEST_PASSWORRD_SUCCESS = '[App] On Request Password Success';

export const REGISTER_SOCIAL_USER = '[Auth] Social Login';
export const SET_SOCIAL_USER = '[Auth] Set Social Login';

export const REMOVE_USER = '[Auth] Remove User';

export const SET_COMPANY_NAME = '[Auth] Company Name User';
export const SET_COMPANY_NAME_SUCCESS = '[Auth] Company Name Success';

export const GET_ORG_USERS = '[Auth] Org Users User';
export const GET_ORG_USERS_SUCCESS = '[Auth] Org Users Success';

export const GET_ORG_VISUALS = '[Auth] Org Users User';
export const GET_ORG_VISUALS_SUCCESS = '[Auth] Org Users Success';

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

  constructor(public payload: LoginResponse) {}
}

export class LoadAuthSetting implements Action {
  readonly type = LOAD_AUTH_SETTING;
}

export class LoadAuthSettingSuccess implements Action {
  readonly type = LOAD_AUTH_SETTING_SUCCESS;
  constructor(
    public payload: {
      authSetting: IAuthTokenSetting[];
    }
  ) {}
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

export class RegisterSocialUser implements Action {
  readonly type = REGISTER_SOCIAL_USER;

  constructor(public payload: { user: AppSocialUser }) {}
}

export class SetCompanyName implements Action {
  readonly type = SET_COMPANY_NAME;

  constructor(public payload: { CompanyName: string }) {}
}
export class SetSocialUser implements Action {
  readonly type = SET_SOCIAL_USER;

  constructor(
    public payload: {
      userDetail: LoginResponse;
    }
  ) {}
}

export class SetCompanyNameSuccess implements Action {
  readonly type = SET_COMPANY_NAME_SUCCESS;

  constructor(public payload: { CompanyName: string }) {}
}

export class RemoveUser implements Action {
  readonly type = REMOVE_USER;
}

// action types
export type AppAction =
  | OnLogin
  | OnLoginSuccess
  | Logout
  | onSignUp
  | RegisterSocialUser
  | SetSocialUser
  | SetCompanyNameSuccess
  | RemoveUser
  | SetCompanyName
  | SignUpSuccess
  | LoadAuthSetting
  | LoadAuthSettingSuccess;
