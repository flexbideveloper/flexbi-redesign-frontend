import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { RouteInfo } from './sidebar.metadata';
import { take, tap } from 'rxjs';
import { data } from 'jquery';
import * as pbi from 'powerbi-client';
import { Report } from 'report';

import {
  EmbededResponse,
  ReportPayload,
  ReportService,
} from 'src/app/services/report.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  report: pbi.Embed;
  @ViewChild('reportContainer', { static: false }) reportContainer: ElementRef;
  menuItems: RouteInfo[] = [];
  activatedPlan: boolean = false;
  activePlanDetail: SubscriptionPlan;
  public isTrialActivated: any = false;
  public reportObj: EmbededResponse;

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
    let userId = '107';
    userId && this.subscriptionService.getActivePlan(userId).subscribe((data) => {
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
            let visualsList: any = [];
            this.reportService
              .getAllReportsListByCustomerAndWorkspace(
                this.authService.getLoggedInUserDetails().UserId
              )
              .subscribe(async(res: any) => {
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
                  // check for pages and visuals
                  if (res.isReportPagesPresent) {
                    this.menuItems.push({
                      path: 'summaryreport',
                      title: 'Summary Report',
                      icon: 'bx bxs-report',
                      class: '',
                      badge: '',
                      badgeClass: '',
                      isExternalLink: false,
                      submenu: [],
                    });
                    // check for visuals
                    if (!res.isDbVisualsPresent) {
                      // fetch the visuals
                      this.reportObj = res.tokenRes;
                      let embedUrl = 'https://app.powerbi.com/reportEmbed';
                      let embedReportId = this.reportObj.embedUrl[0].reportId;
                      let settings: pbi.IEmbedSettings = {
                        filterPaneEnabled: true,
                        navContentPaneEnabled: true,
                      };


                      let config: pbi.IEmbedConfiguration = {
                        type: 'report',
                        tokenType: pbi.models.TokenType.Embed,
                        accessToken: this.reportObj.accessToken,
                        embedUrl: embedUrl,
                        id: embedReportId,
                        filters: [],
                        settings: settings,
                      };
                      let reportContainer = this.reportContainer.nativeElement;
                      let powerbi = new pbi.service.Service(
                        pbi.factories.hpmFactory,
                        pbi.factories.wpmpFactory,
                        pbi.factories.routerFactory
                      );
                      // this.report = await powerbi.embed(reportContainer, config);
                      const report: Report = <Report>(powerbi.embed(reportContainer, config));
                      report.off('loaded');

                      report.on('loaded', async () => {
                        console.log("Loaded");
                        const fetchCalls: any = [];
                        await report.getPages().then(async(p: any) => {
                          await res.reportPages.map(async(rp: any)=> {
                            const pageObj = this.getPageObj(p, rp.PageName, rp.EmbedPage);
                            fetchCalls.push(pageObj.getVisuals().then(async(visuals: any) => {
                              if(visuals && visuals.length > 0) {
                                await visuals.map(async(v: any)=>{
                                  await res.visualSettings.map((vs: any) => {
                                    if (vs.VisualName === v.title){
                                      // insert visual into the DB
                                      visualsList.push({
                                        id_FkReportPage: rp.id,
                                        id_FkClientProfile: userId,
                                        VisualName: v.name,
                                        VisualDisplayName: v.title,
                                        Height: v.layout.height,
                                        Width: v.layout.width
                                      });
                                    }
                                  });
                                });
                              }
                            }))
                          });
                          return Promise.all(fetchCalls).then((res)=>{
                            if (visualsList.length > 0) {
                              console.log(visualsList);
                              this.reportService.uploadVisuals({data: visualsList}).subscribe(
                                (res: any) => {
                                  if (res.status === 200) {
                                    console.log("Visuals added");
                                  } else {
                                    console.log("Failed to add visuals");
                                  }
                                }
                              );
                            }
                          }, (errrr: any)=> {
                            console.log(errrr);
                          });
                        }, (er: any)=> {
                          console.log(er);
                        });
                      });
                      report.on('error', () => {
                        console.log('Error');
                      });
                    }
                  }
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

  getPageObj(pages, pname, embedPage) {
    let page: any;
    if (!embedPage) {
      pages.map((p: any)=> {
        if (p.name === pname){
          page = p;
        }
      });
      return page;
    }
    return null;
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
