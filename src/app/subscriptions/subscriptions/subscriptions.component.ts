import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { AcceptPaymentPromptComponent } from '../accept-payment-prompt/accept-payment-prompt.component';
import { CompanyNameComponent } from '../company-name/company-name.component';
import { SubscriptionPlan } from './subscription.interface';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
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
  constructor(
    private subscriptionService: SubcriptionsService,
    private authService: AuthService,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private notification: NotificationService
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
        this.authService.getLoggedInUserDetails().UserId,
        planId
      );
    } else {
      this.getSubscriptionsPlans();
    }
    this.getActivePlan();
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
    let userId = user_id && user_id !== null ? user_id : this.authService.getLoggedInUserDetails().UserId;
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
      this.subscriptionService.getUserApprovedOrNot(this.authService.getLoggedInUserDetails().id ? this.authService.getLoggedInUserDetails().id : (this.authService.getLoggedInUserDetails().ClientUserId ? this.authService.getLoggedInUserDetails().ClientUserId : this.authService.getLoggedInUserDetails().UserId)).subscribe((data) => {
        this.approvalPending = data?.data?.IsApproved === 0 ? true : false;
      });
    }
  }

  activateFreeTrail() {
    const userId = this.authService.getLoggedInUserDetails().UserId;
    let CompanyName = this.authService.getLoggedInUserDetails().CompanyName;
    // check for company name

    if (CompanyName && CompanyName?.length > 0) {
      this.activateFreeTrialPlanMethod(userId);
    } else {
      // show company name accept dialog
      const modal = this.modalService.open(CompanyNameComponent, {
        centered: true,
      });
      modal.componentInstance.user_id = this.authService.getLoggedInUserDetails().id ? this.authService.getLoggedInUserDetails().id : (this.authService.getLoggedInUserDetails().ClientUserId ? this.authService.getLoggedInUserDetails().ClientUserId : this.authService.getLoggedInUserDetails().UserId);
      modal.result.then((data: any) => {
        console.log("Success");
        if (data && data.status === 200 && data.orgData && data.orgData.id) {
          this.updateUserDetails(data);
          this.activateFreeTrialPlanMethod(data.orgData.id);
        }
      }, (data: any) => {
        console.log("Success");
        if (data && data.status === 200 && data.orgData && data.orgData.id) {
          this.updateUserDetails(data);
          this.activateFreeTrialPlanMethod(data.orgData.id);
        }
      })
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
        },1000);
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
      id_FkClientProfile
    };
  }

  activatePlan(plan) {
    const userId = this.authService.getLoggedInUserDetails().UserId;
    const orgId = this.authService.getLoggedInUserDetails().UserId;
    let CompanyName = this.authService.getLoggedInUserDetails().CompanyName; // check for company name
    let id_FkClientProfile = this.authService.getLoggedInUserDetails().UserId;

    // show company name accept dialog
    if (id_FkClientProfile && id_FkClientProfile !== null && CompanyName && CompanyName?.length > 0) {
      this.activateNewPlan(plan, userId, orgId, CompanyName, id_FkClientProfile);
    } else {
      // show company name accept dialog
      const modal = this.modalService.open(CompanyNameComponent, {
        centered: true,
      });
      modal.componentInstance.user_id = this.authService.getLoggedInUserDetails().id ? this.authService.getLoggedInUserDetails().id : (this.authService.getLoggedInUserDetails().ClientUserId ? this.authService.getLoggedInUserDetails().ClientUserId : this.authService.getLoggedInUserDetails().UserId);
      modal.result.then((data: any) => {
        console.log("Success");
        if (data && data.status === 200 && data.orgData && data.orgData.id) {
          this.updateUserDetails(data);
          this.activateNewPlan(plan, userId, data.orgData.id, CompanyName, id_FkClientProfile);
        }
      }, (data: any) => {
        console.log("Success");
        if (data && data.status === 200 && data.orgData && data.orgData.id) {
          this.updateUserDetails(data);
          this.activateNewPlan(plan, userId, data.orgData.id, CompanyName, id_FkClientProfile);
        }
      })
    }
  }

  updateUserDetails(data) {
    let logInUser = this.authService.getLoggedInUserDetails();
    logInUser.UserId = data.orgData.id;
    this.authService.setLoggedInUserDetails(logInUser);
    const ux =
        (sessionStorage.getItem('identity') &&
          JSON.parse(sessionStorage.getItem('identity'))) ||
        null;
      ux.CompanyName = data.orgData.CompanyName;
      ux.id_FkClientProfile = data.orgData.id;
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
