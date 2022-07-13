import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';

export interface SubscriptionPlan {
  PlanName: string;
  id: number;
  PlanDetails: string;
  Amount: number;
  Days: number;
  IsActive: boolean;
  CreatedDate: string;
  CreatedBy: number;
  UpdatedDate: string;
  UpdatedBy: string;
}
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  subscriptionPlans: SubscriptionPlan[];
  dumysubPlanList: SubscriptionPlan[];
  constructor(
    private subscriptionService: SubcriptionsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getSubscriptionsPlans();
  }

  getSubscriptionsPlans() {
    this.subscriptionService.getSubscriptions().subscribe((data) => {
      this.subscriptionPlans = data.filter((el) => el.IsActive);
      this.dumysubPlanList = data;
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
      // this.dialogService
      //   .open(DialogAcceptInputPromptComponent, {
      //     hasBackdrop: true,
      //     closeOnBackdropClick: false,
      //     closeOnEsc: false,
      //     context: {
      //       userId,
      //     },
      //   })
      //   .onClose.subscribe((param: any) => {
      //     if (param === 'SUCCESS') {
      //       this.activateFreeTrialPlanMethod(userId);
      //     }
      //   });
    }
  }

  activateFreeTrialPlanMethod(userId) {
    // activate free trial plan
    this.subscriptionService.activateFreeTrail(userId).subscribe((res: any) => {
      if (res && res.status === 200) {
        sessionStorage.setItem('subDetails', JSON.stringify(res.planData));
        setTimeout(() => {
          // this._router.navigate(['pages/userreports']);
          window.location.reload();
        }, 500);
      }
    });
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
}
