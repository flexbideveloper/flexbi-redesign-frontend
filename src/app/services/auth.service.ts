import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import {
  AdminLoginResponse,
  AppSocialUserResponse,
  CapchaVerified,
  ChangePassword,
  CheckPasswordRequest,
  CheckPasswordResponse,
  LoginResponse,
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
} from '../interfaces/auth.interface';
import * as a from 'src/app/store/actions';
import * as s from 'src/app/store/selectors';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    protected store: Store,
    private notification: NotificationService
  ) {}

  isLoggedIn$: Observable<boolean> = combineLatest([
    this.store.select(s.getUserDetails),
    this.store.select(s.getAccessToken),
  ]).pipe(
    map(([userToken, accessToken]) => {
      if (!accessToken || !userToken) {
        return false;
      }
      return true;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  getAccessToken(): Observable<string> {
    return of(sessionStorage.getItem('authToken'));
  }

  clientLogin(paylod: SignInRequest): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_LOGIN}`;
    const params = new HttpParams();
    params.append('skipAuthorization', 'true');
    return this.http
      .post<LoginResponse>(url, paylod, {
        params: { skipAuthorization: 'true' },
      })
      .pipe(
        mergeMap((response) => {
          if (response && response.status === 200) {
            sessionStorage.setItem('identity', JSON.stringify(response.data));
            this.store.dispatch(new a.OnLogin(response.data));
            return of(response);
          } else {
            this.notification.error(response.message);
            throw new Error("Couldn't Find anyuser!");
          }
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  captchValidate(token: string): Observable<CapchaVerified> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CAPTCHA_VALIDATE}`;
    return this.http.post<CapchaVerified>(url, { token });
  }

  signUp(form: SignUpRequest): Observable<SignUpResponse> {
    let body = {
      Email: form.email,
      CompanyName: form.companyName,
      Password: form.password,
      UserName: form.firstName + '' + form.lastName,
      Provider: form.Provider,
    };
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.REGISTER}`;
    return this.http.post<SignUpResponse>(url, body, {
      params: { skipAuthorization: 'true' },
    });
  }

  resetLinkValid(obj: CheckPasswordRequest): Observable<CheckPasswordResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CHECK_RESET_LINK}`;
    return this.http.post<CheckPasswordResponse>(
      url,
      { obj },
      { params: { skipAuthorization: 'true' } }
    );
  }

  requestPasswordChange(emailId: string): Observable<CheckPasswordResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.REQUEST_PASSWORD_CHANGE}`;
    return this.http.post<CheckPasswordResponse>(
      url,
      { emailId },
      { params: { skipAuthorization: 'true' } }
    );
  }

  passwordChange(data: ChangePassword): Observable<CheckPasswordResponse> {
    let obj = {
      Password: data.password,
      passCode: data.passCode,
    };
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CHANGE_PASSWORD}`;
    return this.http.post<CheckPasswordResponse>(url, { obj });
  }

  registerUserByThirdParty(data): Observable<AppSocialUserResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_PROFILE}`;
    return this.http.post<AppSocialUserResponse>(url, data, {
      params: { skipAuthorization: 'true' },
    });
  }
}
