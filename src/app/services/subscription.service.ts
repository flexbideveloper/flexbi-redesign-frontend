import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import { AppSocialUserResponse } from '../interfaces/auth.interface';
import {
  SubscriptionPlan,
  SubscriptionResponse,
} from '../subscriptions/subscriptions/subscription.interface';

@Injectable({
  providedIn: 'root',
})
export class SubcriptionsService {
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

  activateFreeTrail(userId: string): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_ACTIVE_FREE}${userId}`;
    return this.http.get<any>(url);
  }

  addCompanyName(data: {
    CompanyName: string;
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
