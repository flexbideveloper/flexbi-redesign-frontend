import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { IGetMessages } from '../shared/conversions/conversions.component';

export interface IMessage {
  UserID: number;
  UserName: string;
  Email: string;
  MessageID: string;
  Message: string;
  MessageDateTime: string;
  MessageDate: string;
  UserCount: number;
  CountLabel: string;
  IsAdvisor: boolean;
}

export interface IGetResponse<T> {
  status: number;
  data: {
    [key: string]: T;
  };
}

export interface IGetResponseByID<T> {
  status: number;
  data: T;
}

export interface IReqConversion {
  id_FkUserProfile:  number;
  id_FkClientProfile:  number;
  Message: string;
}

export interface IReqMessagById {
  Message: string;
  id_FkParentMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageUpdateGEt = new BehaviorSubject<Boolean>(false);
  constructor(private http: HttpClient, private authService: AuthService) {}

  getConversions(): Observable<IGetResponse<IGetResponse<IMessage[]>>> {
    let userId = this.authService.getLoggedInUserDetails().OrgId;
    if (userId === null || userId === undefined) {
      userId = JSON.parse(localStorage.getItem("loggedInUserDetails")).OrgId;
    }
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CONVERSIONS}${userId}`;
    return this.http.get<IGetResponse<IGetResponse<IMessage[]>>>(url);
  }

  postConversion(payload: IReqConversion): Observable<IGetResponse<IMessage>> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CONVERSIONS}`;
    if (payload && payload.id_FkClientProfile === null || payload.id_FkClientProfile === undefined) {
      payload.id_FkClientProfile = JSON.parse(localStorage.getItem("loggedInUserDetails")).OrgId;
    }
    return this.http.post<IGetResponse<IMessage>>(url, payload);
  }

  getConversionsMessageById(
    msgId: string
  ): Observable<IGetResponseByID<IMessage[]>> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CONVERSIONS_MESAGE_BU_ID}${msgId}`;
    return this.http.get<IGetResponseByID<IMessage[]>>(url);
  }

  postConversionById(
    request: IReqMessagById
  ): Observable<IGetResponseByID<IMessage>> {
    const payload: IReqConversion = {
      id_FkUserProfile: this.authService.getLoggedInUserDetails().userProfileId,
      id_FkClientProfile:
        !this.authService.getLoggedInUserDetails().OrgId ? JSON.parse(localStorage.getItem("loggedInUserDetails")).OrgId : this.authService.getLoggedInUserDetails().OrgId,
      ...request,
    };
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CONVERSIONS}`;
    return this.http.post<IGetResponseByID<IMessage>>(url, payload);
  }

  isAdviser(): Observable<IGetResponse<any>> {
    const id_FkUserProfile =
      this.authService.getLoggedInUserDetails().userProfileId;
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.IS_ADVISER_ACTIVE}${id_FkUserProfile}`;
    return this.http.get<IGetResponse<any>>(url, {});
  }

  getConversionsMessage(
    id: string | number
  ): Observable<IGetResponse<IMessage[]>> {
    if (id === null || id === undefined) {
      id = JSON.parse(localStorage.getItem("loggedInUserDetails")).OrgId;
    }
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CONVERSIONS}${id}`;
    return this.http.get<IGetResponse<IMessage[]>>(url);
  }
}
