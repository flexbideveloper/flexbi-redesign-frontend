import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as pbi from 'powerbi-client';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import {
  EmbededResponse,
  ReportPayload,
  ReportService,
} from 'src/app/services/report.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { SubscriptionPlan } from 'src/app/subscriptions/subscriptions/subscription.interface';

@Component({
  selector: 'app-report-display',
  templateUrl: './report-display.component.html',
  styleUrls: ['./report-display.component.scss'],
})
export class ReportDisplayComponent implements OnInit {
  report: pbi.Embed;
  @ViewChild('reportContainer', { static: false }) reportContainer: ElementRef;
  activePlanDetail: SubscriptionPlan;

  loading = false;
  public searchText = '';
  public reportsList: any = [];
  public dummyAllReportLists: any = [];
  public reportPrint: any = null;

  public isNewUser: any = false;

  public reportObj: EmbededResponse;

  showStatus: boolean = false;
  messageStatus: string = 'success';
  alertMessage: string = '';

  reportAllocationSort = {
    ReportName: 'asc',
    ReportID: 'asc',
    WorkspaceID: 'asc',
    WorkSpaceName: 'asc',
  };

  public isTrialActivated: any = false;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private subscriptionService: SubcriptionsService,
    private notification: NotificationService
  ) {
    this.getActivePlan();
  }

  ngOnInit() {
    let reportPayload: ReportPayload = {
      reportId: this.activeRoute.snapshot.params['reportId'],
      workspaceId: this.activeRoute.snapshot.params['workspaceId'],
      xeroReport: this.activeRoute.snapshot.params['xeroReport'],
      userId: this.authService.getLoggedInUserDetails().UserId,
    };
    if (
      reportPayload.workspaceId &&
      reportPayload.workspaceId !== null &&
      reportPayload.reportId &&
      reportPayload.reportId !== null
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = (
        future: any,
        curr: any
      ): boolean => {
        // return !(curr.routerState.url === future.routerState.url);
        return false;
      };

      this.reportService.getEmbededReport(reportPayload).subscribe(
        (res: any) => {
          this.isNewUser = false;
          this.reportObj = res.data;
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
          this.report = powerbi.embed(reportContainer, config);
          this.report.off('loaded');
          this.report.on('loaded', () => {
            // this.setTokenExpirationListener(Token.expiration, 2);
            this.reportPrint = powerbi.get(reportContainer);
          });
          this.report.on('error', () => {
            console.log('Error');
            this.notification.error('Report not loaded.');
          });
        },
        (error: any) => {
          this.notification.error('Failed to get report details. Try again...');
        }
      );
    } else {
      this.isNewUser = true;
      this.notification.error('Report not loaded.');
      // window.location.reload();
    }
  }

  openFullscreen() {
    var elem = document.getElementById('report-container');
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  printReportAsPDf() {
    this.reportPrint.print().catch((error) => {
      console.log(error);
    });
  }

  getActivePlan() {
    let userId = this.authService.getLoggedInUserDetails().UserId;
    this.subscriptionService.getActivePlan(userId).subscribe((data) => {
      this.activePlanDetail = data.data[0];
      if (this.activePlanDetail.id_FkSubscriptionPlan === 1) {
        this.isTrialActivated = true;
      }
    });
  }
}
