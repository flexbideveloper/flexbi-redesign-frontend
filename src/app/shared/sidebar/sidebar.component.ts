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

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
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
    // this.menuItems = FLEXBI_ROUTES.filter((menuItem) => menuItem);

    if (
      localStorage.getItem('identity') == null ||
      localStorage.getItem('identity') == 'false'
    ) {
      this.router.navigate(['/pages/login']);
    } else {
      let user =
        this.authService.getLoggedInUserDetails &&
        this.authService.getLoggedInUserDetails();
      if (user.UserRole && user.UserRole === 'USER') {
        // get the report list...
        let userId = this.authService.getLoggedInUserDetails().UserId;
        this.subscriptionService.getActivePlan(userId).subscribe((data) => {
          this.activePlanDetail = data.data[0];
          if (this.activePlanDetail) {
            this.subscriptionService.ifHaveActivePlan.next(true);
          }
          if (this.activePlanDetail.id_FkSubscriptionPlan === 1) {
            this.isTrialActivated = true;
          }
          if (this.activePlanDetail) {
            // check for plan expiry..
            if (this.getRemainingDays() === 'Plan is Expired.') {
              this.router.navigate(['pages/subscriptions']);
            } else {
              let reportsList = [];
              // tslint:disable-next-line:max-line-length
              this.reportService
                .getAllReportsListByCustomerAndWorkspace(
                  this.authService.getLoggedInUserDetails().UserId
                )
                .subscribe(
                  (res: any) => {
                    reportsList = res.data || [];
                    if (reportsList.length > 0) {
                      let child = [];
                      reportsList.map((r: any) => {
                        child.push({
                          path:
                            'reports/' +
                            r.RptID +
                            '/' +
                            r.WorkspID +
                            '/' +
                            (r.xeroReport && r.xeroReport === true
                              ? true
                              : false),
                          title: r.ReportName,
                          icon: 'bx bx-right-arrow-alt',
                          class: '',
                          badge: '',
                          badgeClass: '',
                          isExternalLink: false,
                          submenu: [],
                        });
                      });

                      this.menuItems.push({
                        path: '',
                        title: 'Dashboard',
                        icon: 'bx bx-home-circle',
                        class: 'sub',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: child,
                      });
                      this.menuItems.push({
                        title: 'Subscription Plans',
                        icon: 'bx bx-diamond',
                        path: 'subscriptions',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalpath: false,
                        submenu: [],
                      });

                      // let child = [];

                      // this.menuItems.push({
                      //   path: '',
                      //   title: 'Dashboard',
                      //   icon: 'bx bx-home-circle',
                      //   class: 'sub',
                      //   badge: '',
                      //   badgeClass: '',
                      //   isExternalLink: false,
                      // });

                      // this.menuItems.push({
                      //   title: 'Subscription Plans',
                      //   icon: 'bx bx-home-circle',
                      //   path: 'subscriptions',
                      //   class: 'sub',
                      //   badge: '',
                      //   badgeClass: '',
                      //   isExternalLink: false,
                      // });
                      if (window.location.pathname === '/pages/userreports') {
                        this.router.navigate([
                          this.menuItems[0].submenu[0].path,
                        ]);
                      }
                    } else {
                      // this.menuItems.push({
                      //   icon: 'home-outline',
                      //   path: '/pages/userreports',
                      //   title: 'Reports'
                      // });
                      // temporaray code for adding menu

                      this.menuItems.push({
                        title: 'Xero Integration',
                        icon: 'bx bx-repeat',
                        path: 'data-accounts',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalpath: false,
                        submenu: [],
                      });
                      this.menuItems.push({
                        title: 'Subscription Plans',
                        icon: 'bx bx-diamond',
                        path: 'subscriptions',
                        class: '',
                        badge: '',
                        badgeClass: '',
                        isExternalpath: false,
                        submenu: [],
                      });
                      if (window.location.pathname === 'userreports') {
                        this.router.navigate([this.menuItems[0].path]);
                      }
                    }
                  },
                  (res: any) => {
                    this.menuItems.push({
                      path: 'report',
                      title: 'Reports',
                      icon: 'bx bx-fle-circle',
                      class: 'sub',
                      badge: '',
                      badgeClass: '',
                      isExternalpath: false,
                      submenu: [],
                    });
                    this.router.navigate([this.menuItems[0].path]);
                  }
                );
            }
          } else {
            this.router.navigate(['pages/subscriptions']);
          }
        });
      }
    }
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
