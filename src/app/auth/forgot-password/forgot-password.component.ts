import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as fromStore from '@app/core/store';
import { ConfirmedValidator } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  resetForm: FormGroup;
  step: number = 0;
  show = true;
  cShow = true;
  uniqueId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private appStore: Store<fromStore.AppState>,
    private notification: NotificationService
  ) {
    this.uniqueId = this.route.snapshot.queryParams['passCode'] || '';
    if (this.uniqueId) {
      this.step = 1;
      this.authService.resetLinkValid({ UniqueID: this.uniqueId }).subscribe(
        (userdata: any) => {
          if (userdata.status == 500) {
            this.notification.error(
              'Invalid user, please contact administratior'
            );
          } else if (userdata.status == 400) {
            this.notification.error(
              'Your link is expired, please regenarate again...'
            );
          } else {
            sessionStorage.setItem('authToken', 'Bearer ' + userdata.token);
          }
        },
        (res: any) => {
          this.notification.error(
            'Invalid user, please contact administratior'
          );
        }
      );
    }
  }

  // On SignIn link click
  onSignIn(): void {
    this.router.navigate(['auth/sign-in'], { relativeTo: this.route.parent });
  }

  requestForgetPassword() {
    if (this.form.invalid) {
      return;
    }
    this.authService
      .requestPasswordChange(this.form.value.emailId)
      .subscribe((res) => {
        if (res.status == 500) {
          this.notification.error(
            'Failed to send the reset password link...Please try again'
          );
        } else if (res.status == 404) {
          this.notification.error(
            'Email address incorrect. Please check your email address or contact us at support@flexbi.com.au'
          );
        } else if (res.status == 409) {
          this.notification.error(res.message);
        } else {
          this.notification.success(
            'We have sent you reset password link to your ' +
              this.form.value.emailId +
              ' id, please check your email.'
          );
        }
      });
  }

  onForgetPassword(): void {
    this.resetForm.patchValue({
      passCode: this.uniqueId,
    });
    if (this.resetForm.invalid) {
      return;
    }
    this.authService.passwordChange(this.resetForm.value).subscribe((res) => {
      if (res.status == 500) {
        this.notification.error('Failed to change the password...try again');
      } else if (res.status == 404) {
        this.notification.error(
          'Failed to change the password...try again. Please check your email address or contact us at support@flexbi.com.au'
        );
      } else if (res.status == 409) {
        this.notification.error(res.message);
      } else {
        this.notification.success(
          'Your password updated successfully. Please login to system by using your credentials'
        );
        this.step = 0;
        this.router.navigateByUrl('auth/sign-in');
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ],
        ],
        cPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ],
        ],
        passCode: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator('password', 'cPassword'),
      }
    );
  }
}
