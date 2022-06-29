import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import { LoginPayload, LoginResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  adminLogin(paylod: LoginPayload): Observable<LoginResponse> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.ADMIN_LOGIN}`;
    return this.http.post<LoginResponse>(url, paylod);
  }
}
