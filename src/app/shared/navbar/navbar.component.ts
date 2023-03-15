import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SidebarService } from '../sidebar/sidebar.service';
import * as fromStore from '@app/core/store';
import { AuthService } from 'src/app/services/auth.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { SubscriptionPlan } from 'src/app/subscriptions/subscriptions/subscription.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  userDetails$ = this.appStore.select(fromStore.getUserDetails);
  activePlanDetail: SubscriptionPlan;

  expStatus: string = '';
  remDays: string = '';
  constructor(
    public sidebarservice: SidebarService,
    private appStore: Store<fromStore.AppState>,
    private authService: AuthService,
    private subscriptionService: SubcriptionsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    let userId = this.authService.getLoggedInUserDetails()?.UserId;
    if (userId && userId !== null) {
      this.subscriptionService.getActivePlan(userId).subscribe((data) => {
        this.activePlanDetail = data.data[0];
        this.expStatus = this.getExpiryStatus(data.data[0]);
        this.remDays = this.getRemainingDays(data.data[0]);
        this.cdr.markForCheck();
      });
    }
  }

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  ngOnInit() {
    /* Search Bar */
    $(document).ready(function () {
      $('.mobile-search-icon').on('click', function () {
        $('.search-bar').addClass('full-search-bar');
      }),
        $('.search-close').on('click', function () {
          $('.search-bar').removeClass('full-search-bar');
        });
    });
  }

  getExpiryStatus(planDetails: any) {
    if (!!planDetails) {
      if (new Date().getTime() >= new Date(planDetails.EndDate).getTime()) {
        return 'EXPIRED';
      }
      return 'ACTIVE';
    }
    return '';
  }

  getRemainingDays(planDetails: any) {
    if (!!planDetails) {
      let diffDays = 0;
      diffDays = new Date(planDetails.EndDate).getTime() - new Date().getTime();
      diffDays = diffDays / (1000 * 3600 * 24);
      diffDays = Number(diffDays);
      diffDays = Math.ceil(diffDays);
      if (diffDays > 0) {
        return diffDays + ' days left';
      } else {
        return 'Plan is Expired.';
      }
    }
    return '';
  }

  showSubPlans() {
    this.router.navigate(['subscriptions']);
  }

  logout(): void {
    this.appStore.dispatch(new fromStore.Logout());
    // this.socialAuthService.signOut();
    // this.setConfigurationService
    //   .checkSetConfigurationPageForLeaving()
    //   .pipe(take(1))
    //   .subscribe(canLeave => {
    //     if (!canLeave) return;
    //     this.appStore.dispatch(new fromStore.Logout());
    //   });
  }
}
