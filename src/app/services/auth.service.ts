import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import {
  AppSocialUserResponse,
  CapchaVerified,
  ChangePassword,
  CheckPasswordRequest,
  CheckPasswordResponse,
  IAuthTokenSetting,
  LoginResponse,
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
} from '../interfaces/auth.interface';
import * as fromStore from '@app/core/store';
import { NotificationService } from './notification.service';
import {
  IUsersResponse,
  IVisualResponse,
} from '@app/core/store/interface/common.interface';
import { getAuthSettings } from '@app/core/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  socialLogin = new BehaviorSubject(false);
   getAuthValue: IAuthTokenSetting[];
  constructor(
    private http: HttpClient,
    protected store: Store,
    private notification: NotificationService
  ) {}

  isLoggedIn$: Observable<boolean> = combineLatest([
    this.store.select(fromStore.getUserDetails),
    this.store.select(fromStore.getAccessToken),
  ]).pipe(
    map(([userToken, accessToken]) => {
      if (!accessToken) {
        return false;
      }
      return true;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  setLogin(v: boolean) {
    this.socialLogin.next(v);
  }
  getAccessToken(): Observable<string> {
    return of(JSON.parse(sessionStorage.getItem('BearerToken')));
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
            sessionStorage.setItem(
              'BearerToken',
              JSON.stringify(response.token)
            );
            this.setLoggedInUserDetails({
              UserId: response.data.id_FkClientProfile,
              ClientUserId: response.data.id,
              UserName: response.data.UserName,
              CompanyName: response.data.CompanyName,
              id_FkClientProfile: response.data.id_FkClientProfile,
              Email: response.data.Email,
              UserRole: 'USER',
              UserRoleId: 100,
            });

            this.store.dispatch(new fromStore.OnLogin(response));
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

  setLoggedInUserDetails(userDetails: any) {
    localStorage.setItem('loggedInUserDetails', JSON.stringify(userDetails));
  }

  captchValidate(token: string): Observable<CapchaVerified> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CAPTCHA_VALIDATE}`;
    return this.http.post<CapchaVerified>(
      url,
      { token },
      {
        params: { skipAuthorization: 'true' },
      }
    );
  }

  signUp(form: SignUpRequest): Observable<SignUpResponse> {
    let body = {
      Email: form.email,
      // CompanyName: form.companyName,
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

  registerUserByThirdParty(data): Observable<LoginResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_PROFILE}`;
    return this.http.post<LoginResponse>(url, data, {
      params: { skipAuthorization: 'true' },
    });
  }

  allSettings(): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.ALL_SETTING}`;
    return this.http
      .get<any>(url, {
        params: { skipAuthorization: 'true' },
      })
  }


  getLoggedInUserDetails() {
    if (localStorage.getItem('loggedInUserDetails') != null) {
      return JSON.parse(localStorage.getItem('loggedInUserDetails'));
    }
    return null;
  }

  getUserLists(id: string | number): Observable<IUsersResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.GET_USERS}/${id}`;
    return this.http.get<IUsersResponse>(url);
  }

  getVisualsList(id: string | number): Observable<IVisualResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.GET_VISUALS}/${id}`;
    return this.http.get<IVisualResponse>(url);
  }

  get getAuthDetails() :IAuthTokenSetting[]{
     this.store.select(getAuthSettings).subscribe(data =>  {
      this.getAuthValue = data
    });
    return this.getAuthValue
  }

 
}
