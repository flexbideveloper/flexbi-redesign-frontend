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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private appStore: Store<fromStore.AppState>
  ) {}

  // On Signup link click
  onSignIn() {
    this.router.navigate(['sign-in/user'], { relativeTo: this.route.parent });
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        companyName: ['', Validators.required],
        password: ['', [Validators.required]],
        cPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'cPassword'),
      }
    );
  }

  onSignUp() {
    if (!this.signUpForm.valid) {
      return;
    }
    this.appStore.dispatch(new a.OnLogin(this.signUpForm.value));
  }

  handleSuccess($event): void {
    if ($event && $event !== null) {
      // this.store
    }
  }
  validatorRepassword(form: FormControl): { [key: string]: boolean } | null {
    if (form.value.password === form.value.cPassword) {
      return null;
    }
    return { errorRepeatPassword: true };
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
