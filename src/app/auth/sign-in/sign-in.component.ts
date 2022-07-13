import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
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
import { NotificationService } from 'src/app/services/notification.service';
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
  captchaSiteKey =
    sessionStorage.getItem('CAPTCHAKEY') ||
    JSON.parse(sessionStorage.getItem('CAPTCHAKEY')).CaptchaKey;
  isCaptchaValidate: boolean = false;
  isNoRobotClick: boolean = false;
  user: SocialUser;

  appState$: Subscription;

  loginType: LoginTypeEnum;
  aFormGroup = this.fb.group({
    recaptcha: ['', Validators.required],
  });
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private notification: NotificationService
  ) {}

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
    if (
      this.form.valid &&
      this.aFormGroup.valid &&
      this.isNoRobotClick &&
      this.isCaptchaValidate
    ) {
      this.onLoginHandler().subscribe(
        (_) => {
          /* do nothing */
        },
        ({ status, error }) => {
          this.isLoggingIn = false;
        }
      );
    } else {
      !this.isCaptchaValidate
        ? this.notification.error('Not Valid captcha.')
        : null;
      return;
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
          this.notification.error('Sorry! Cannot Login.');
        } else if (err.status === 401) {
          this.notification.error(err.error[0]);
        } else if (err.status === 404) {
          this.notification.error(err.message);
        }
        return throwError(err);
      })
    );
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      UserName: ['', [Validators.required, Validators.email]],
      PassWord: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      gcmTonken: [
        sessionStorage.getItem('CAPTCHAKEY') ||
          JSON.parse(sessionStorage.getItem('CAPTCHAKEY')).CaptchaKey,
      ],
    });
  }

  handleSuccess($event): void {
    if ($event && $event !== null) {
      this.authService.captchValidate($event).subscribe(
        (res: any) => {
          if (res && res.status === 200) {
            this.isNoRobotClick = true;
            this.isCaptchaValidate = true;
          } else {
            this.isNoRobotClick = false;
            this.isCaptchaValidate = false;
            this.notification.error('Not Valid captcha.');
          }
        },
        (err: any) => {
          this.isNoRobotClick = false;
          this.isCaptchaValidate = false;
          this.notification.error('Not Valid captcha.');
        }
      );
    }
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy(): void {
    // this.appState$.unsubscribe();
  }
}

@Component({
  selector: 'app-auth',
  template: `<router-outlet></router-outlet>`,
})
export class AuthComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.subscription = this.authService.allSettings().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
