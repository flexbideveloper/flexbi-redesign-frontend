import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthGuard } from '../gaurd/not-auth.gaurd';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthComponent, SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [NotAuthGuard],
    component: AuthComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        data: {
          title: 'Sign In',
          value: 'user',
        },
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        data: {
          title: 'Sign Up',
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          title: 'Forgot Password',
        },
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password',
        },
      },
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch:'full'
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
