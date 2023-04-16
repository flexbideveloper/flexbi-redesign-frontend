import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsersResponse, IVisualResponse } from '@app/core/store/interface/common.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import { IReportPageVisuals } from '../summary-report/interfaces/report.interface';
import { AuthService } from './auth.service';

export interface EmbededResponse {
  accessToken: string;
  embedUrl: any;
  expiry: string;
  status: number;
}

export interface ReportPayload {
  reportId: string;
  userId: number;
  workspaceId: string;
  xeroReport: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  socialLogin = new BehaviorSubject(false);
  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmbededReport(data: ReportPayload): Observable<EmbededResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.GET_REPORT}`;
    return this.http.post<EmbededResponse>(url, data);
  }

  // getXeroAuthLink() {
  //   this.getBaseUrl();
  //   const userId = this.dataService.getLoggedInUserId();
  //   return this.httpClient.get(
  //     this.baseUrl + 'xerotokenaccess/authLink/' + userId,
  //     this.getHttpOptions()
  //   );
  // }

  getWFMBtnLink(): Observable<string> {
    let userId = this.authService.getLoggedInUserDetails().OrgId;
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.WFM_AUTH_URL_GET}${userId}`;
    return this.http.get<string>(url);
  }

  getXeroAuthLink(): Observable<string> {
    let userId = this.authService.getLoggedInUserDetails().OrgId;
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.XERO_AUTH_URL_GET}${userId}`;
    return this.http.get<string>(url);
  }

  getAllReportsListByCustomerAndWorkspace(customerId: any): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.REPORT_ALLOCATION_LIST}`;
    return this.http.post<any>(url, { customerId });
  }

  uploadVisuals(data: any): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.PAGE_VISUALS}`;
    return this.http.post<EmbededResponse>(url, data);
  }

  getPageVisuals(id:string | number): Observable<IReportPageVisuals> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.PAGE_VISUALS}/${id}`;
    return this.http.get<IReportPageVisuals>(url);
  }


}
