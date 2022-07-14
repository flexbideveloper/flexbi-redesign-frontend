import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import { AppSocialUserResponse } from '../interfaces/auth.interface';
import { SubscriptionPlan } from '../subscriptions/subscriptions/subscriptions.component';

import { NotificationService } from './notification.service';

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

  activateFreeTrail(userId): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.SUBSCRIPTION_ACTIVE_FREE} ${userId}`;

    return this.http.get<any>(url);
  }

  addCompanyName(data: {
    CompanyName: string;
    UserId: string;
  }): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_PROFILE_COMPANY_NAME}`;
    return this.http.post<any>(url, data);
  }
}
