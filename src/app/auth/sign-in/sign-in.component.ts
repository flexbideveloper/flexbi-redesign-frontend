import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  catchError,
  mergeMap,
  Observable,
  of,
  Subscription,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

export enum LoginTypeEnum {
  Admin = 'admin',
  User = 'user',
}
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  form: FormGroup;
  show: boolean = true;
  isLoggingIn: boolean;

  appState$: Subscription;

  loginType: LoginTypeEnum;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.route.data.subscribe((data) => {
      this.loginType =
        data['value'] === LoginTypeEnum.User
          ? LoginTypeEnum.User
          : LoginTypeEnum.Admin;
    });
  }

  // On Forgotpassword link click
  onForgotpassword() {
    this.router.navigate(['forgot-password'], {
      relativeTo: this.route.parent,
    });
  }

  // On Signup link click
  onSignup() {
    this.router.navigate(['sign-up'], { relativeTo: this.route.parent });
  }

  onLogin(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoggingIn = true;
    if (this.loginType == LoginTypeEnum.User) {
      this.onLoginHandler().subscribe(
        (_) => {
          /* do nothing */
        },
        ({ status, error }) => {
          this.isLoggingIn = false;
        }
      );
    } else {
      this.onLoginHandlerAdmin().subscribe(
        (_) => {
          /* do nothing */
        },
        ({ status, error }) => {
          this.isLoggingIn = false;
        }
      );
    }
  }

  onLoginHandler(): Observable<any> {
    return this.authService.clientLogin(this.form.value).pipe(
      mergeMap((data) => {
        return of(data);
      }),
      catchError((err) => {
        // this.error = true;
        if (err.status === 403) {
          // this.errorMessage = 'Sorry! Cannot Login.';
        } else if (err.status === 401) {
          // this.errorMessage = err.error[0];
        } else if (err.status === 404) {
          console.log(err.message);
        }
        return throwError(err);
      })
    );
  }

  onLoginHandlerAdmin(): Observable<any> {
    return this.authService.adminLogin(this.form.value).pipe(
      mergeMap((data) => {
        return of(data);
      }),
      catchError((err) => {
        // this.error = true;
        if (err.status === 403) {
          // this.errorMessage = 'Sorry! Cannot Login.';
        } else if (err.status === 401) {
          // this.errorMessage = err.error[0];
        } else if (err.status === 404) {
          console.log(err.message);
        }
        return throwError(err);
      })
    );
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      UserName: ['', [Validators.required]],
      PassWord: ['', Validators.required],
      gcmTonken: [environment.gcmToken],
    });
  }

  ngOnDestroy(): void {
    // this.appState$.unsubscribe();
  }
}
