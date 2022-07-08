import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store';
import * as a from 'src/app/store/actions/app.action';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  show: boolean = true;
  cShow: boolean = true;
  captchaSiteKey = environment.captchaKey;

  aFormGroup = this.fb.group({
    recaptcha: ['', Validators.required],
  });

  isCaptchaValidate: boolean = false;
  isNoRobotClick: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private appStore: Store<fromStore.AppState>,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  // On Signup link click
  onSignIn() {
    this.router.navigate(['auth/sign-in'], { relativeTo: this.route.parent });
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        companyName: ['', Validators.required],
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
        Provider: [],
      },
      {
        validator: ConfirmedValidator('password', 'cPassword'),
      }
    );
  }

  onSignUp() {
    this.signUpForm.patchValue({
      Provider: 'SIGNUP',
    });
    if (
      this.signUpForm.valid &&
      this.aFormGroup.valid &&
      this.isNoRobotClick &&
      this.isCaptchaValidate
    ) {
      this.appStore.dispatch(new a.onSignUp({ form: this.signUpForm.value }));
    }
  }

  validatorRepassword(form: FormControl): { [key: string]: boolean } | null {
    if (form.value.password === form.value.cPassword) {
      return null;
    }
    return { errorRepeatPassword: true };
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
}

export function ConfirmedValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    const matchingControl = formGroup.controls[matchingControlName];

    if (
      matchingControl.errors &&
      !matchingControl.errors['errorRepeatPassword']
    ) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ errorRepeatPassword: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
