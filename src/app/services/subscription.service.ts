import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import { AppSocialUserResponse } from '../interfaces/auth.interface';
import {
  DataLoadProcess,
  SubscriptionPlan,
  SubscriptionResponse,
} from '../subscriptions/subscriptions/subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubcriptionsService {
  ifHaveActivePlan = new BehaviorSubject(false);

  socialLogin = new BehaviorSubject(false);
  constructor(private http: HttpClient, protected store: Store) {}

  registerUserByThirdParty(data): Observable<AppSocialUserResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_PROFILE}`;
    return this.http.post<AppSocialUserResponse>(url, data, {
      params: { skipAuthorization: 'true' },
    });
  }

  getSubscriptions(): Observable<SubscriptionPlan[]> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_LIST}`;
    return this.http.get<SubscriptionPlan[]>(url);
  }

  getActivePlan(userId: string): Observable<SubscriptionResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_ACTIVE_GET}${userId}`;
    return this.http.get<SubscriptionResponse>(url);
  }

  getUserApprovedOrNot(userProfileId: string): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.USER_APPROVED_OR_NOT}${userProfileId}`;
    return this.http.get<any>(url);
  }

  checkDataLoadProcess(userId: string): Observable<DataLoadProcess> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.DATA_LOAD_PROCESS}${userId}`;
    return this.http.get<DataLoadProcess>(url);
  }

  getXeroAccessTokenDetails(userId: string): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.ACCESS_TOKEN}${userId}`;
    return this.http.get<any>(url);
  }

  getDataLoadSteps(userId: string): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.GET_LOGS_STATUS}${userId}`;
    return this.http.get<any>(url);
  }

  activateFreeTrail(userId: string): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_ACTIVE_FREE}${userId}`;
    return this.http.get<any>(url);
  }

  notifyAdmin(data: {
    firstName: string;
    lastName: string,
    companyName: string,
    contactNumber: string,
    type: string,
    userId: string;
  }): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.NOTIFY_ADMIN}`;
    return this.http.post<any>(url, data);
  }

  registerAsAdvisor(data: {
    firstName: string;
    companyName: string,
    contactNumber: string,
    type: string,
    userId: string;
  }): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.REGISTER_AS_ADVISOR}${data.userId}`;
    return this.http.post<any>(url, data);
  }

  addCompanyName(data: {
    CompanyName: string;
    Email: string,
    userId: string;
  }): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_PROFILE_COMPANY_NAME}`;
    return this.http.post<any>(url, data);
  }

  getSharedPaymentURL(data: {
    PlanId: string;
    userId: string;
  }): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_PAYMENT_URL}`;
    return this.http.post<any>(url, data);
  }

  getTheTransactionStatus(data: {
    isTranComplete: boolean;
    AccessCode: string;
    userId: string;
    planId: number;
  }): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_STATUS}`;
    return this.http.post<any>(url, data);
  }
}
