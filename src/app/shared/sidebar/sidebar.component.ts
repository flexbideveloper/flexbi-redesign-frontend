import { Component, OnInit } from '@angular/core';
import { FLEXBI_ROUTES } from './sidebar-routes.config';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { SidebarService } from './sidebar.service';

import * as $ from 'jquery';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionPlan } from 'src/app/subscriptions/subscriptions/subscription.interface';
import { ReportService } from 'src/app/services/report.service';
import { RouteInfo } from './sidebar.metadata';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = [];
  activatedPlan: boolean = false;
  activePlanDetail: SubscriptionPlan;
  public isTrialActivated: any = false;

  constructor(
    public sidebarservice: SidebarService,
    private router: Router,
    public subscription: SubcriptionsService,
    private authService: AuthService,
    private subscriptionService: SubcriptionsService,
    private reportService: ReportService
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (
        event instanceof NavigationEnd &&
        $(window).width() < 1025 &&
        (document.readyState == 'complete' || false)
      ) {
        this.toggleSidebar();
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
    this.subscription.ifHaveActivePlan.subscribe((plan) => {
      this.activatedPlan = plan;
    });
  }

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());

    if ($('.wrapper').hasClass('nav-collapsed')) {
      // unpin sidebar when hovered
      $('.wrapper').removeClass('nav-collapsed');
      $('.sidebar-wrapper').unbind('hover');
    } else {
      $('.wrapper').addClass('nav-collapsed');
      $('.sidebar-wrapper').hover(
        function () {
          $('.wrapper').addClass('sidebar-hovered');
        },
        function () {
          $('.wrapper').removeClass('sidebar-hovered');
        }
      );
    }
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  ngOnInit() {
    this.menuItems = FLEXBI_ROUTES.filter((menuItem) => menuItem);
  }

  getRemainingDays() {
    if (this.activePlanDetail) {
      let diffDays = 0;
      diffDays =
        new Date(this.activePlanDetail.EndDate).getTime() -
        new Date().getTime();
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
}
