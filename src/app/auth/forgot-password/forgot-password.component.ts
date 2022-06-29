import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: UntypedFormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {}

  // On SignIn link click
  onSignIn(): void {
    this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
  }

  onForgetPassword(): void {
    //forget password form submit
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
