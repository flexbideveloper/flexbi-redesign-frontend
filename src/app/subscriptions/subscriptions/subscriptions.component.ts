import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { CompanyNameComponent } from '../company-name/company-name.component';

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

  freePlan: SubscriptionPlan[];
  premiumPlans: SubscriptionPlan[];
  constructor(
    private subscriptionService: SubcriptionsService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getSubscriptionsPlans();
  }

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
