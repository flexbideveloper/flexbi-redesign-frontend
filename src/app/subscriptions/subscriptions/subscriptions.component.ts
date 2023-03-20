import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
// import { IUser , IVisual } from 'src/app/shared/input-suggetion/containers/input-box/input-box.component';
import { AcceptPaymentPromptComponent } from '../accept-payment-prompt/accept-payment-prompt.component';
import { CompanyNameComponent } from '../company-name/company-name.component';
import { SubscriptionPlan } from './subscription.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IUser, IVisual } from 'src/app/shared/input-suggetion/containers/input-box/input-box.component';
import { Store } from '@ngrx/store';
import { isAdvisor } from '@app/core/store';
import * as fromAppStore from '@app/core/store';
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  items : IUser[] =
  [
         {
            "userId":1001,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin1@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1002,
            "UserName":"IJ Test",
            "Email":"ijindrajeet1@outlook.com",
            "IsAdvisor":0
         },
         {
            "userId":1003,
            "UserName":"Don Eau",
            "Email":"doneau@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1004,
            "UserName":"Don Eau",
            "Email":"don.eau@mainsheet.com.au",
            "IsAdvisor":0
         },
         {
            "userId":1005,
            "UserName":"TJDemoJadhav",
            "Email":"demo@demo.com",
            "IsAdvisor":0
         },
         {
            "userId":1006,
            "UserName":"TJUser",
            "Email":"demo1@demo1.com",
            "IsAdvisor":0
         },
         {
            "userId":1007,
            "UserName":"AnotherUser",
            "Email":"demo2@demo2.com",
            "IsAdvisor":0
         },
         {
            "userId":1008,
            "UserName":"ajayP",
            "Email":"demo3@demo3.com",
            "IsAdvisor":0
         },
         {
            "userId":1009,
            "UserName":"test123test",
            "Email":"demo4@demo4.com",
            "IsAdvisor":0
         },
         {
            "userId":1012,
            "UserName":"AjayShinde",
            "Email":"demo5@demo5.com",
            "IsAdvisor":1
         },
         {
            "userId":1013,
            "UserName":"Tejasassa",
            "Email":"demo6@demo6.com",
            "IsAdvisor":1
         },
         {
            "userId":1014,
            "UserName":"Demosdsdsd",
            "Email":"demo7@demo7.com",
            "IsAdvisor":0
         },
         {
            "userId":1015,
            "UserName":"Demosdsdsd",
            "Email":"demo8@demo8.com",
            "IsAdvisor":0
         },
         {
            "userId":1016,
            "UserName":"NewAccount",
            "Email":"demo9@demo9.com",
            "IsAdvisor":0
         },
         {
            "userId":1017,
            "UserName":"vita nagarpalika",
            "Email":"vitanagarpalikaaws@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1018,
            "UserName":"AjayNew",
            "Email":"demo99@demo99.com",
            "IsAdvisor":0
         },
         {
            "userId":1019,
            "UserName":"safaridsdsds",
            "Email":"demo11@demo.com",
            "IsAdvisor":0
         },
         {
            "userId":1020,
            "UserName":"sddsdsdsdsd",
            "Email":"demo22@demo.com",
            "IsAdvisor":0
         },
         {
            "userId":1021,
            "UserName":"dsdsddssdsd",
            "Email":"demo33@demo.com",
            "IsAdvisor":0
         },
         {
            "userId":1022,
            "UserName":"sdsdddssdsd",
            "Email":"demo44@demo.com",
            "IsAdvisor":0
         },
         {
            "userId":1027,
            "UserName":"Tejas Jadhav",
            "Email":"scopeupaws@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1028,
            "UserName":"Tejas Jadhav",
            "Email":"tejas.jadhav6767@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1029,
            "UserName":"anotherdsddsd",
            "Email":"demo333@d.com",
            "IsAdvisor":1
         },
         {
            "userId":1030,
            "UserName":"Indrajeet Jadhav",
            "Email":"indrajeet.developer1@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1033,
            "UserName":"IndraJ",
            "Email":"ijindrajeet@outlook.com",
            "IsAdvisor":0
         },
         {
            "userId":1045,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin2@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1046,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin3@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1047,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin4@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1048,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin5@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1049,
            "UserName":"Kunal Patidar",
            "Email":"itskunaldev@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1050,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin6@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1051,
            "UserName":"Indrajeet Jadhav",
            "Email":"indrajeet.developer@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1052,
            "UserName":"Tejas Jadhav",
            "Email":"jadhavlogin@gmail.com",
            "IsAdvisor":0
         },
         {
            "userId":1053,
            "UserName":"Hemant Patidar",
            "Email":"iamhemant.indore@gmail.com",
            "IsAdvisor":0
         }
      ];
  form: FormGroup = this.fb.group({
    status: [''],
  });
  status: string = '';
  formValue = '';
    itemsB : IVisual[] = [
      {
         "VisualName":"989cee2306deaccc8fce",
         "VisualDisplayName":"Findings - Revenue",
         "visualId":437
      },
      {
         "VisualName":"f747183852ce8817f023",
         "VisualDisplayName":"Unpaid Balance %",
         "visualId":438
      },
      {
         "VisualName":"ab37c7941f62c1b466af",
         "VisualDisplayName":"Revenue %",
         "visualId":439
      },
      {
         "VisualName":"7c70e847951a1d4b6100",
         "VisualDisplayName":"Customer Pattern",
         "visualId":440
      },
      {
         "VisualName":"b944a20a05230600d5c0",
         "VisualDisplayName":"Top 20 Customers by Revenue",
         "visualId":441
      },
      {
         "VisualName":"a4cfbf83546b00a36787",
         "VisualDisplayName":"Top 20 Creditors",
         "visualId":442
      },
      {
         "VisualName":"7497b4f51c02b52ab302",
         "VisualDisplayName":"Estimated Cashflow - next 28 days",
         "visualId":443
      },
      {
         "VisualName":"5e36d125cd68f566947f",
         "VisualDisplayName":"Findings - Cashflow",
         "visualId":444
      },
      {
         "VisualName":"4be273429b9d6b9e5048",
         "VisualDisplayName":"Top 20 Debtors",
         "visualId":445
      }
   ];
  subscriptionPlans: SubscriptionPlan[];
  dumysubPlanList: SubscriptionPlan[];
  activePlanDetail: SubscriptionPlan;

  freePlan: SubscriptionPlan[];
  premiumPlans: SubscriptionPlan[];

  approvalPending: any = false;

  public isTranComplete: any = null;
  public AccessCode: any = null;
  public tranObj: any = {};

  public subDetails: any = null;
  public isPlanActivated: any = false;
  public isTrialActivated: any = false;

  public orglist: any = this.store.select(fromAppStore.selectOrgLists);
  public isAdvisor: any = this.store.select(fromAppStore.isAdvisor);

  constructor(
    private subscriptionService: SubcriptionsService,
    private authService: AuthService,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private notification: NotificationService,
    private fb: FormBuilder,
    private store:Store,
    private router:Router
  ) {
    if (
      this.activeRoute.snapshot.queryParamMap.get('isTranComplete') !== null &&
      this.activeRoute.snapshot.queryParamMap.get('AccessCode') !== null
    ) {
      this.AccessCode =
        this.activeRoute.snapshot.queryParamMap.get('AccessCode');
      this.isTranComplete =
        this.activeRoute.snapshot.queryParamMap.get('isTranComplete');
      const planId = this.activeRoute.snapshot.queryParamMap.get('planId');
      this.getTheTransactionStatus(
        this.isTranComplete,
        this.AccessCode,
        this.authService.getLoggedInUserDetails().OrgId,
        planId
      );
    } else {
      this.getSubscriptionsPlans();
    }
    !this.isAdvisor && this.getActivePlan();
  }

  ngOnInit(): void {}

  getSubscriptionsPlans() {
    this.subscriptionService.getSubscriptions().subscribe((data) => {
      this.subscriptionPlans = data.filter((el) => el.IsActive);
      this.dumysubPlanList = data;
      this.freePlan = data.filter((el) => el.id === 1);
      this.premiumPlans = data.filter(
        (el) => el.id !== 1 && el.IsActive === true
      );
    });
  }

  getActivePlan(user_id: any = null) {
    let userId =
      user_id && user_id !== null
        ? user_id
        : this.authService.getLoggedInUserDetails().OrgId;
    if (userId && userId !== null) {
      this.subscriptionService.getActivePlan(userId).subscribe((data) => {
        this.activePlanDetail = data.data[0];
        if (!!this.activePlanDetail) {
          this.subscriptionService.ifHaveActivePlan.next(true);
        }
        if (this.activePlanDetail.id_FkSubscriptionPlan === 1) {
          this.isTrialActivated = true;
        }
      });
    }
    if (!this.authService.getLoggedInUserDetails().orgId) {
      // Is user approved
      this.subscriptionService
        .getUserApprovedOrNot(
          this.authService.getLoggedInUserDetails().id
            ? this.authService.getLoggedInUserDetails().id
            : this.authService.getLoggedInUserDetails().userProfileId
            ? this.authService.getLoggedInUserDetails().userProfileId
            : this.authService.getLoggedInUserDetails().OrgId
        )
        .subscribe((data) => {
          this.approvalPending = data?.data?.IsApproved === 0 ? true : false;
        });
    }
  }

  activateFreeTrail() {
    const userId = this.authService.getLoggedInUserDetails().OrgId;
    let CompanyName = this.authService.getLoggedInUserDetails().CompanyName;
    // check for company name

    if (CompanyName && CompanyName?.length > 0) {
      this.activateFreeTrialPlanMethod(userId);
    } else {
      // show company name accept dialog
      const modal = this.modalService.open(CompanyNameComponent, {
        centered: true,
      });
      modal.componentInstance.user_id =
        this.authService.getLoggedInUserDetails().id
          ? this.authService.getLoggedInUserDetails().id
          : this.authService.getLoggedInUserDetails().userProfileId
          ? this.authService.getLoggedInUserDetails().userProfileId
          : this.authService.getLoggedInUserDetails().OrgId;
      modal.result.then(
        (data: any) => {
          console.log('Success');
          if (data && data.status === 200) {
            if (data.orgData && data.orgData.id) {
              this.updateUserDetails(data);
              this.activateFreeTrialPlanMethod(data.orgData.id);
              this.isAdvisor=false;
            } else if (data.markedAsAdvisor){
              // show marked as advisor message
              this.isAdvisor=true;
            }
          }
        },
        (data: any) => {
          console.log('Success');
          if (data && data.status === 200) {
            if (data.orgData && data.orgData.id) {
              this.updateUserDetails(data);
              this.activateFreeTrialPlanMethod(data.orgData.id);
              this.isAdvisor=false;
            } else if (data.markedAsAdvisor){
              // show marked as advisor message
              this.isAdvisor=true;
            }
          }
        }
      );
    }
  }

  activateFreeTrialPlanMethod(userId) {
    // activate free trial plan
    this.subscriptionService.activateFreeTrail(userId).subscribe((res: any) => {
      if (res && res.status === 200) {
        // sessionStorage.setItem('subDetails', JSON.stringify(res.planData));
        setTimeout(() => {
          this.getActivePlan(userId);
          window.location.reload();
        }, 1000);
      }
    });
  }

  activateNewPlan(plan, userId, orgId, CompanyName, id_FkClientProfile) {
    const modal = this.modalService.open(AcceptPaymentPromptComponent, {
      centered: true,
    });

    modal.componentInstance.planRequest = {
      orgId,
      CompanyName,
      PlanName: plan.PlanName,
      PlanAmount: plan.Amount,
      PlanId: plan.id,
      id_FkClientProfile,
    };
  }

  activatePlan(plan) {
    const userId = this.authService.getLoggedInUserDetails().OrgId;
    const orgId = this.authService.getLoggedInUserDetails().OrgId;
    let CompanyName = this.authService.getLoggedInUserDetails().CompanyName; // check for company name
    let id_FkClientProfile = this.authService.getLoggedInUserDetails().OrgId;

    // show company name accept dialog
    if (
      id_FkClientProfile &&
      id_FkClientProfile !== null &&
      CompanyName &&
      CompanyName?.length > 0
    ) {
      this.activateNewPlan(
        plan,
        userId,
        orgId,
        CompanyName,
        id_FkClientProfile
      );
    } else {
      // show company name accept dialog
      const modal = this.modalService.open(CompanyNameComponent, {
        centered: true,
      });
      modal.componentInstance.user_id =
        this.authService.getLoggedInUserDetails().id
          ? this.authService.getLoggedInUserDetails().id
          : this.authService.getLoggedInUserDetails().userProfileId
          ? this.authService.getLoggedInUserDetails().userProfileId
          : this.authService.getLoggedInUserDetails().OrgId;
      modal.result.then(
        (data: any) => {
          console.log('Success');
          if (data && data.status === 200) {
            if (data.orgData && data.orgData.id) {
              this.updateUserDetails(data);
              this.activateNewPlan(
                plan,
                userId,
                data.orgData.id,
                CompanyName,
                id_FkClientProfile
              );
              this.isAdvisor=false;
            } else {
              // marked as advisor
              this.isAdvisor=true;
            }
          }
        },
        (data: any) => {
          console.log('Success');
          if (data && data.status === 200) {
            if (data.orgData && data.orgData.id) {
              this.updateUserDetails(data);
              this.activateNewPlan(
                plan,
                userId,
                data.orgData.id,
                CompanyName,
                id_FkClientProfile
              );
              this.isAdvisor=false;
            } else {
              // marked as advisor
              this.isAdvisor=true;
            }
          }
        }
      );
    }
  }

  updateUserDetails(data) {
    let logInUser = this.authService.getLoggedInUserDetails();
    logInUser.OrgId = data.orgData.id;
    this.authService.setLoggedInUserDetails(logInUser);
    const ux =
      (sessionStorage.getItem('identity') &&
        JSON.parse(sessionStorage.getItem('identity'))) ||
      null;
    ux.CompanyName = data.orgData.CompanyName;
    ux.OrgId = data.orgData.id;
    ux.id = data.orgData.id;
    sessionStorage.setItem('identity', JSON.stringify(ux));
  }

  getPlan(type) {
    const plans = [];
    if (type === 'TRIAL') {
      this.dumysubPlanList.map((c: any) => {
        if (c.id === 1) {
          plans.push(c);
        }
      });
    } else {
      this.dumysubPlanList.map((c: any) => {
        if (c.id !== 1 && c.IsActive) {
          plans.push(c);
        }
      });
    }
    return plans;
  }

  getTheTransactionStatus(isTranComplete, AccessCode, userId, planId) {
    this.subscriptionService
      .getTheTransactionStatus({
        isTranComplete,
        AccessCode,
        userId,
        planId,
      })
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.tranObj = {
              isTranVerified: res.isTranVerified,
              tranId: res.tranId,
              planData: res.planData,
            };
            this.getActivePlan();
            this.getSubscriptionsPlans();
            window.location.reload();
          } else {
            this.tranObj = {
              isTranVerified: false,
              tranId: null,
              planData: null,
            };
            this.getActivePlan();
            this.getSubscriptionsPlans();
          }
          // this.loading = false;
        },
        (res: any) => {
          this.notification.success(
            'Failed to get transaction details. Try again...'
          );
        }
      );
  }
}
