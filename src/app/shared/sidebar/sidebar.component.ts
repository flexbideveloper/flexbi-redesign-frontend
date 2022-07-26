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
import { take, tap } from 'rxjs';
import { data } from 'jquery';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = [];
  activatedPlan: boolean = false;
  activePlanDetail: SubscriptionPlan;
  public isTrialActivated: any = false;
  collapsed: boolean = false;
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
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
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
    let userId = this.authService.getLoggedInUserDetails().UserId;
    this.subscriptionService.getActivePlan(userId).subscribe((data) => {
      this.activePlanDetail = data.data[0];
      if (!!this.activePlanDetail) {
        this.subscriptionService.ifHaveActivePlan.next(true);
      }
      if (this.activePlanDetail?.id_FkSubscriptionPlan === 1) {
        this.isTrialActivated = true;
      }
      let user = this.authService.getLoggedInUserDetails();

      if (user.UserRole && user.UserRole === 'USER') {
        if (!!this.activePlanDetail) {
          // check for plan expiry..
          if (this.getRemainingDays() === 'Plan is Expired.') {
            this.menuItems.push({
              path: 'subscriptions',
              title: 'Subscription Plans',
              icon: 'bx bx-diamond',
              class: '',
              badge: '',
              badgeClass: '',
              isExternalLink: false,
              submenu: [],
            });
            this.router.navigate(['subscriptions']);
          } else {
            let reportsList = [];
            this.reportService
              .getAllReportsListByCustomerAndWorkspace(
                this.authService.getLoggedInUserDetails().UserId
              )
              .subscribe((res: any) => {
                reportsList = res.data || [];
                if (reportsList.length > 0) {
                  let child = [];
                  reportsList.map((r: any) => {
                    child.push({
                      path:
                        'report/' +
                        r.RptID +
                        '/' +
                        r.WorkspID +
                        '/' +
                        (r.xeroReport && r.xeroReport === true ? true : false),
                      title: r.ReportName,
                      icon: 'bx bx-file',
                      class: '',
                      badge: '',
                      badgeClass: '',
                      isExternalLink: false,
                      submenu: [],
                    });
                  });
                  this.menuItems.push({
                    path: '',
                    title: 'Reports',
                    icon: 'bx bx-file',
                    class: 'sub',
                    badge: '',
                    badgeClass: '',
                    isExternalLink: false,
                    submenu: child,
                  });
                  this.menuItems.push({
                    path: 'subscriptions',
                    title: 'Subscription Plans',
                    icon: 'bx bx-diamond',
                    class: '',
                    badge: '',
                    badgeClass: '',
                    isExternalLink: false,
                    submenu: [],
                  });

                  if (window.location.href.indexOf('data-accounts') >= 0) {
                    this.router.navigate([this.menuItems[0].submenu[0].path]);
                  }
                } else {
                  this.menuItems.push({
                    path: 'data-accounts',
                    title: 'Xero Integration',
                    icon: 'bx bx-repeat',
                    class: '',
                    badge: '',
                    badgeClass: '',
                    isExternalLink: false,
                    submenu: [],
                  });
                  this.menuItems.push({
                    path: 'subscriptions',
                    title: 'Subscription Plans',
                    icon: 'bx bx-diamond',
                    class: '',
                    badge: '',
                    badgeClass: '',
                    isExternalLink: false,
                    submenu: [],
                  });
                  if (window.location.pathname === '/report') {
                    this.router.navigate([this.menuItems[0].path]);
                  }
                }
              });
          }
        } else {
          this.menuItems.push({
            path: 'subscriptions',
            title: 'Subscription Plans',
            icon: 'bx bx-diamond',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
          });
          this.router.navigate(['subscriptions']);
        }
      }
    });

    // this.menuItems = FLEXBI_ROUTES.filter((menuItem) => menuItem);
    $.getScript('./assets/js/app-sidebar.js');
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
