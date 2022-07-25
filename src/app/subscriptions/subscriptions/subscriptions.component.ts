import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  getActivePlan() {
    let userId = this.authService.getLoggedInUserDetails().UserId;
    this.subscriptionService.getActivePlan(userId).subscribe((data) => {
      this.activePlanDetail = data.data[0];
      debugger;
      if (!!this.activePlanDetail) {
        this.subscriptionService.ifHaveActivePlan.next(true);
      }
      if (this.activePlanDetail.id_FkSubscriptionPlan === 1) {
        this.isTrialActivated = true;
      }
    });
  }

  activateFreeTrail() {
    const userId = this.authService.getLoggedInUserDetails().UserId;
    const CompanyName = this.authService.getLoggedInUserDetails().CompanyName;
    // check for company name

    if (CompanyName && CompanyName.length > 0) {
      this.activateFreeTrialPlanMethod(userId);
    } else {
      // show company name accept dialog
      const modal = this.modalService.open(CompanyNameComponent, {
        centered: true,
      });

      modal.componentInstance.user_id = userId;
    }
  }

  activateFreeTrialPlanMethod(userId) {
    // activate free trial plan
    this.subscriptionService.activateFreeTrail(userId).subscribe((res: any) => {
      if (res && res.status === 200) {
        window.location.reload();
        // sessionStorage.setItem('subDetails', JSON.stringify(res.planData));
        this.getActivePlan();
      }
    });
  }

  activatePlan(plan) {
    const userId = this.authService.getLoggedInUserDetails().UserId;
    const CompanyName = this.authService.getLoggedInUserDetails().CompanyName;
    // check for company name
    // show company name accept dialog
    const modal = this.modalService.open(AcceptPaymentPromptComponent, {
      centered: true,
    });

    modal.componentInstance.planRequest = {
      userId,
      CompanyName,
      PlanName: plan.PlanName,
      PlanAmount: plan.Amount,
      PlanId: plan.id,
    };
    // .onClose.subscribe((param: any) => {
    //   if (param.status && param.status === 200) {
    //     sessionStorage.setItem('subDetails', JSON.stringify(param.planData));
    //   }
    // });
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
