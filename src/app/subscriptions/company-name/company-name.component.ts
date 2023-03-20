import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import * as fromStore from '@app/core/store';
import { getAuthSettings } from '@app/core/store';

export interface ConfirmAction {
  text: string;
  callback(): void;
}

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss'],
})
export class CompanyNameComponent implements OnInit {
  signUpForm: FormGroup;
  show: boolean = true;
  cShow: boolean = true;

  aFormGroup = this.fb.group({
    recaptcha: ['', Validators.required],
  });
  authSetting$ =  this.store.select(getAuthSettings);
  form: FormGroup;
  @Input() user_id: string;

  inputProductType: any = 1;

  isCaptchaValidate: boolean = false;
  isNoRobotClick: boolean = false;

  @Input() confirmText: string;
  @Input() yesAction: ConfirmAction;
  @Input() noAction: ConfirmAction;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    public router: Router,
    private subscription: SubcriptionsService,
    private authService: AuthService,
    private notification: NotificationService,
    private store: Store<fromStore.AppState>
  ) {}

  ngOnInit(): void {
    const logInUser = this.authService.getLoggedInUserDetails();
    this.form = this.fb.group({
      CompanyName: ['', Validators.required],
      Email: ['', Validators.required],
      userId: [this.authService.getLoggedInUserDetails().id ? this.authService.getLoggedInUserDetails().id : this.user_id],
      UserEmail: logInUser.Email ? logInUser.Email : ''
    });
    this.signUpForm = this.fb.group(
      {
        firstName: [logInUser.UserName || '' , Validators.required],
        // lastName: ['', Validators.required],
        contactNumber: ['', Validators.required],
        companyName: [logInUser.CompanyName || '', Validators.required],
        userId: [this.user_id],
        type: ['SELF-NEW-USER-REGISTRATION-FOR-EXISTING-ORG']
      }
    );
  }

  submit() {
    if (this.inputProductType === "2") {
      if (this.form.invalid) {
        return;
      }
      if (this.form.value.userId === null) {
        this.form.value.userId = this.authService.getLoggedInUserDetails().id ? this.authService.getLoggedInUserDetails().id : (this.authService.getLoggedInUserDetails().userProfileId ? this.authService.getLoggedInUserDetails().userProfileId : this.authService.getLoggedInUserDetails().OrgId);
      }
      this.subscription.addCompanyName(this.form.value).subscribe(
        (data: any) => {
          if (data.status === 200) {
            // const userDetails = this.authService.getLoggedInUserDetails();
            // userDetails.CompanyName = this.form.value.CompanyName;
            // userDetails.Email = this.form.value.Email;
            // userDetails.OrgId = data.orgData.id;
            // this.authService.setLoggedInUserDetails(userDetails);
            // const ux =
            //   (sessionStorage.getItem('identity') &&
            //     JSON.parse(sessionStorage.getItem('identity'))) ||
            //   null;
            // ux.CompanyName = this.form.value.CompanyName;
            // ux.OrgId = userDetails.id_FkClientProfile;
            // sessionStorage.setItem('identity', JSON.stringify(ux));
            // // this.store.dispatch(new SetCompanyName(this.form.value.CompanyName));
            // this.store.dispatch(
            //   new fromStore.SetCompanyNameSuccess({
            //     CompanyName: this.form.value.CompanyName,
            //   })
            // );
            this.modal.dismiss({
              status: 200,
              orgData: data.orgData
            });
          } else {
            this.notification.error("Organization with same name already present, request your admin to provide you access by selecting first option from dropdown.");
          }
        },
        (res: any) => {
          this.notification.error(res.message);
          this.modal.dismiss({
            status: 500
          });
        }
      );
    } else if(this.inputProductType === "3") {
      // register as advisor
      if (this.signUpForm.invalid) {
        return;
      }
      this.subscription.registerAsAdvisor(this.signUpForm.value).subscribe(
        (data: any) => {
          if (data.status === 200) {
            this.notification.success("Your request is submitted successfully.")
          }
          this.modal.dismiss({
            status: 200
          });
          setTimeout(() => {
            window.location.reload();
          },1000);
        },
        (res: any) => {
          this.notification.error(res.message);
          this.modal.dismiss({
            status: 500
          });
        }
      );
    } else {
      if (this.signUpForm.invalid) {
        return;
      }
      this.subscription.notifyAdmin(this.signUpForm.value).subscribe(
        (data: any) => {
          if (data.status === 200) {
            this.notification.success("Your request is submitted successfully.")
          }
          this.modal.dismiss({
            status: 200
          });
          setTimeout(() => {
            window.location.reload();
          },1000);
        },
        (res: any) => {
          this.notification.error(res.message);
          this.modal.dismiss({
            status: 500
          });
        }
      );
    }
  }

  modelClose() {
    this.modal.close({
      status: 200
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
}
