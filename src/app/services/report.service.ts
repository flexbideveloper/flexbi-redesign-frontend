import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';

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
  constructor(private http: HttpClient) {}

  getEmbededReport(data: ReportPayload): Observable<EmbededResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.GET_REPORT}`;
    return this.http.post<EmbededResponse>(url, data);
  }
}
