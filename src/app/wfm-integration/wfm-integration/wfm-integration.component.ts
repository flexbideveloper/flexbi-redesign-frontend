import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReportService } from 'src/app/services/report.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-wfm-integration',
  templateUrl: './wfm-integration.component.html',
  styleUrls: ['./wfm-integration.component.scss'],
})
export class WFMIntegrationComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  customerList: any = [];
  dumyCustomerList: any = [];
  public searchText = '';
  public pendingApprovals = false;
  public showInActive: boolean = false;
  errorText: string = '';
  showReportActive: boolean = false;
  reportsList = [];
  public tenantsList = [];

  showStatus: boolean = false;
  messageStatus: string = 'success';
  alertMessage: string = '';

  clientSort = {
    clientName: 'asc',
    email: 'asc',
    companyName: 'asc',
  };

  isTokenPrsent: boolean = false;
  authLink: string = '';

  stepperIndex: number = 1;

  showXeroDataLoadProcess: any = false;
  xeroDataLoadCompleted: any = false;

  public selectedTenant: any = null;
  public allJournalLists: any = [];

  subDetails: any = {};
  isDataFetchSuccess: any = false;
  isAccountExpired: any = true;

  dataLoadingSteps: any = null;

  showError: boolean = false;
  active: string = 'auth';

  sub: Subscription;

  constructor(
    private xeroAppService: ReportService,
    private notification: NotificationService,
    public authService: AuthService,
    public subscription: SubcriptionsService,
    public router: Router,
    public reportService: ReportService
  ) {
    this.getSubscriptionDetails();

    const source = interval(5000);
    this.sub = source.subscribe((val) => this.refreshStepper());
  }

  ngOnInit(): void {}

  getReport() {}

  getWFMBtnLink() {
    if (this.stepperIndex === 1 && !this.isTokenPrsent) {
      this.xeroAppService.getWFMBtnLink().subscribe(
        (res: any) => {
          window.open(res.url, 'wfmauth');
          // this.showXeroDataLoadProcess = true;
          this.loading = false;
        },
        (res: any) => {
          this.loading = false;
          this.notification.error(
            'Failed to get list of Customers. Try again...'
          );
        }
      );
    }
  }

  getSubscriptionDetails() {
    this.loading = true;
    this.isDataFetchSuccess = false;
    const userId = this.authService.getLoggedInUserDetails().OrgId;
    userId && this.subscription.getActivePlan(userId).subscribe(
      (res: any) => {
        this.isDataFetchSuccess = true;
        if (res && res.status === 200 && res.data.length > 0) {
          this.subDetails = res.data[0];
          // check for plan
          if (this.getExpiryStatus() !== 'EXPIRED') {
            this.isAccountExpired = false;
            this.checkDataLoadProcess();
          }
        } else {
          this.subDetails = null;
        }
        this.loading = false;
      },
      (res: any) => {
        this.isDataFetchSuccess = true;
        this.subDetails = null;
        this.loading = false;
      }
    );
  }

  checkDataLoadProcess() {
    const userId = this.authService.getLoggedInUserDetails().OrgId;
    this.subscription.checkDataLoadProcess(userId).subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          if (res.isErrorInDataLoad) {
            // call the data load process and steps
            this.showXeroDataLoadProcess = true;
            this.refreshStepper();
          } else {
            // check for access toekn details
            this.getXeroAccessTokenDetails();
          }
        } else {
          this.loading = false;
          this.dataLoadingSteps = null;
        }
      },
      (res: any) => {
        this.loading = false;
      }
    );
  }

  getXeroAccessTokenDetails() {
    this.loading = true;
    const userId = this.authService.getLoggedInUserDetails().OrgId;
    this.isTokenPrsent = false;
    this.subscription.getXeroAccessTokenDetails(userId).subscribe(
      (res: any) => {
        if (res && res.isTokenPrsent) {
          this.isTokenPrsent = res.isTokenPrsent;
          // this.router.navigate(['subscriptions']);
          // this.getTenants();
          this.getDataLoadSteps();
        } else {
          this.isTokenPrsent = false;
        }
        this.loading = false;
      },
      (res: any) => {
        this.loading = false;
        this.notification.error('Failed to get token details. Try again...');
      }
    );
  }

  getDataLoadSteps() {
    const userId = this.authService.getLoggedInUserDetails().OrgId;

    // if (this.showXeroDataLoadProcess) {
    this.subscription.getWFMDataLoadSteps(userId).subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          this.dataLoadingSteps = res.data ? res.data : null;
          this.checkStepsAndPassStepper(this.dataLoadingSteps);
        } else {
          this.loading = false;
          this.dataLoadingSteps = null;
        }
      },
      (res: any) => {
        this.loading = false;
      }
    );
    // } else {
    //   this.dataLoadingSteps = null;
    // }
  }

  checkStepsAndPassStepper(dataStatus: any) {
    if (dataStatus['WFM-AUTH']) {
      if (dataStatus['WFM-AUTH'].isCompleted) {
        this.stepperIndex = 2;
      } else if (dataStatus['WFM-AUTH'].isError) {
        this.showError = true;
        this.errorText = dataStatus['WFM-AUTH'].error;
        this.active == 'load';
      }
    }

    if (dataStatus['WFM-DATA-LOAD']) {
      if (dataStatus['WFM-DATA-LOAD'].isCompleted) {
        this.stepperIndex = 3;
      } else if (dataStatus['WFM-DATA-LOAD'].isError) {
        this.showError = true;
        this.errorText = dataStatus['WFM-DATA-LOAD'].error;
        this.active == 'creation';
      }
    }

    if (dataStatus['WFM-DATA-UPLOAD']) {
      if (dataStatus['WFM-DATA-UPLOAD'].isCompleted) {
        this.stepperIndex = 3;
      } else if (dataStatus['WFM-DATA-UPLOAD'].isError) {
        this.showError = true;
        this.errorText = dataStatus['WFM-DATA-UPLOAD'].error;
        this.active == 'creation';
      }
    }

    if (dataStatus['INITIAL-LOAD-COMPLETE']) {
      if (dataStatus['INITIAL-LOAD-COMPLETE'].isCompleted) {
        this.stepperIndex = 6;
        this.showReportActive = true;
        // window.location.reload();
        this.sub.unsubscribe();
      } else if (dataStatus['INITIAL-LOAD-COMPLETE'].isError) {
        this.showError = true;
        this.errorText = dataStatus['INITIAL-LOAD-COMPLETE'].error;
        this.active == 'final';
      }
    }
  }

  getMyStatusClass(pos: number) {
    if (pos === this.stepperIndex) {
      return 'active';
    }

    if (pos > this.stepperIndex) {
      return '';
    }

    if (pos < this.stepperIndex) {
      return 'done';
    }

    if (pos < this.stepperIndex) {
      return 'done';
    }

    return '';
  }

  refreshStepper() {
    if (this.isTokenPrsent) {
    }
    this.getDataLoadSteps();
  }

  getExpiryStatus() {
    if (this.subDetails !== null) {
      if (new Date().getTime() >= new Date(this.subDetails.EndDate).getTime()) {
        return 'EXPIRED';
      }
      return 'ACTIVE';
    } else {
      return 'PLAN-NOT-PURCHASED';
    }
  }

  showReport() {
    this.reportService
      .getAllReportsListByCustomerAndWorkspace(
        this.authService.getLoggedInUserDetails().OrgId
      )
      .subscribe((res: any) => {
        this.reportsList = res.data || [];
        if (this.reportsList.length > 0) {
          // this.router.navigate([
          //   'report/' +
          //     this.reportsList[0].RptID +
          //     '/' +
          //     this.reportsList[0].WorkspID +
          //     '/' +
          //     (this.reportsList[0].xeroReport &&
          //     this.reportsList[0].xeroReport === true
          //       ? true
          //       : false),
          // ]);
          this.router.navigate(['/summaryreport'])
        }
      });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
