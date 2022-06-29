import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  form: FormGroup;
  show: boolean = true;

  appState$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
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
    this.router.navigate(['../dashboard/default'], {
      relativeTo: this.route.parent,
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.appState$.unsubscribe();
  }
}
