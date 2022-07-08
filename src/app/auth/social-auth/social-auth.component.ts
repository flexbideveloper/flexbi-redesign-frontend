import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { AppSocialUser } from 'src/app/interfaces/auth.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as fromStore from 'src/app/store';
import { RegisterSocialUser } from 'src/app/store';

@Component({
  selector: 'app-social-auth',
  templateUrl: './social-auth.component.html',
  styleUrls: ['./social-auth.component.scss'],
})
export class SocialAuthComponent implements OnInit {
  user: SocialUser;

  constructor(
    private socialAuthService: SocialAuthService,
    private microsoftService: MsalService,
    private appStore: Store<fromStore.AppState>,
    private authService: AuthService
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      if (user && user != null) {
        this.registerWebDonuser(user, 'GOOGLE');
      }
    });
    this.socialAuthService.signOut().then((data) => {
      console.log('Logout google successfully');
    });
    this.authService.isLoggedIn$.subscribe((val) => {
      if (val) {
        this.socialAuthService.signOut();
      }
    });
  }

  ngOnInit(): void {}

  loginWithMicroSoft(): void {
    // this.authService.loginRedirect();
    this.microsoftService
      .loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.microsoftService.instance.setActiveAccount(response.account);
        this.registerWebDonuser(response, 'MICROSOFT');
      });
    // this.authService.logout().subscribe((data: any) => {
    //   console.log("Logout successfully");
    //   this._router.navigate(['login/user']);
    // })
  }

  registerWebDonuser = (user: any, type: string) => {
    let obj: AppSocialUser;
    if (type === 'GOOGLE') {
      obj = {
        UserName: user.name,
        Email: user.email,
        CompanyName: '',
        Provider: 'GOOGLE',
        UniqueID: user.id,
        AuthToken: user.authToken,
      };
    } else {
      obj = {
        UserName: user.account.name,
        Email: user.account.username,
        CompanyName: '',
        Provider: 'MICROSOFT',
        UniqueID: user.account.tenantId,
        AuthToken: user.accessToken,
      };
    }

    this.appStore.dispatch(new RegisterSocialUser({ user: obj }));

    // this.authService.registerUserByThirdParty(obj).subscribe(
    //   (userdata: any) => {
    //     if (userdata.status == 500) {
    //       this.notification.error('Please enter valid username and password');
    //       // this.messageStatus = "danger";
    //       // this.showStatus = true;
    //       // this.alertMessage = "Please enter valid username and password.";
    //       // setTimeout(() => {
    //       //   this.showStatus = false;
    //       // }, 5000);
    //       // localStorage.setItem("isUserAuthenticated", "false");
    //       // this.dataService.setLoggedInUserId(null);
    //       // this.dataService.setLoggedInUserDetails(null);
    //       // this.dataService.setLoggedInUserPermissions(null);
    //       // sessionStorage.removeItem("authToken");
    //     }
    //     if (userdata.status == 400) {
    //       this.notification.error(
    //         'User is deactivated, please contact FlexBI to get your account reactivated.'
    //       );

    //       // this.messageStatus = "danger";
    //       // this.showStatus = true;
    //       // this.alertMessage =
    //       //   "User is deactivated, please contact FlexBI to get your account reactivated.";
    //       // setTimeout(() => {
    //       //   this.showStatus = false;
    //       // }, 5000);
    //       // localStorage.setItem("isUserAuthenticated", "false");
    //       // this.dataService.setLoggedInUserId(null);
    //       // this.dataService.setLoggedInUserDetails(null);
    //       // this.dataService.setLoggedInUserPermissions(null);
    //       // sessionStorage.removeItem("authToken");
    //     } else {
    //       // this._router.navigate(["pages/userreports"]);
    //       // localStorage.setItem("isUserAuthenticated", "true");
    //       // sessionStorage.setItem("authToken", "Bearer " + userdata.token);
    //       // this.dataService.setLoggedInUserId(userdata.data.id);
    //       // this.dataService.setLoggedInUserDetails({
    //       //   UserId: userdata.data.id,
    //       //   UserName: userdata.data.UserName,
    //       //   Email: userdata.data.Email,
    //       //   CompanyName: userdata.data.CompanyName,
    //       //   UserRole: "USER",
    //       //   UserRoleId: 100,
    //       // });
    //       debugger;
    //       // this.dataService.setLoggedInUserPermissions(userdata.data);
    //       // $("nb-sidebar").show();
    //     }
    //   },
    //   (res: any) => {
    //     this.notification.error('Please enter valid username and password.');

    //     // this.messageStatus = "danger";
    //     // this.showStatus = true;
    //     // this.alertMessage = "Please enter valid username and password.";
    //     // setTimeout(() => {
    //     //   this.showStatus = false;
    //     // }, 5000);
    //     // localStorage.setItem("isUserAuthenticated", "false");
    //     // this.dataService.setLoggedInUserId(null);
    //     // this.dataService.setLoggedInUserDetails(null);
    //     // this.dataService.setLoggedInUserPermissions(null);
    //     // sessionStorage.removeItem("authToken");
    //   }
    // );
  };
}
