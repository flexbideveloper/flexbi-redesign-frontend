import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReportService } from 'src/app/services/report.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-xero-integration',
  templateUrl: './xero-integration.component.html',
  styleUrls: ['./xero-integration.component.scss'],
})
export class XeroIntegrationComponent implements OnInit {
  loading: boolean = true;
  customerList: any = [];
  dumyCustomerList: any = [];
  public searchText = '';
  public pendingApprovals = false;
  public showInActive: boolean = false;

  showReportActive: boolean = false;

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

  stepperIndex: number = 0;

  showXeroDataLoadProcess: any = false;
  xeroDataLoadCompleted: any = false;

  public selectedTenant: any = null;
  public allJournalLists: any = [];

  subDetails: any = {};
  isDataFetchSuccess: any = false;
  isAccountExpired: any = true;

  dataLoadingSteps: any = null;

  showError: boolean = false;

  constructor(
    private xeroAppService: ReportService,
    private notification: NotificationService,
    public authService: AuthService,
    public subscription: SubcriptionsService,
    public router: Router
  ) {
    // this.getSubscriptionDetails();
    this.checkStepsAndPassStepper({
      'XERO-AUTH': {
        isCompleted: true,
        isError: false,
        error: '',
      },
      'XERO-DATA-LOAD': {
        isCompleted: true,
        isError: false,
        error: '',
      },
      'DASHBOARD-CREATION': {
        isCompleted: false,
        isError: false,
        error: '',
      },
      'DATASET-REFRESH': {
        isCompleted: false,
        isError: false,
        error: '',
      },
      'INITIAL-LOAD-COMPLETE': {
        isCompleted: false,
        isError: false,
        error: '',
      },
    });
  }

  ngOnInit(): void {}

  getXeroBtnLink() {
    if (this.stepperIndex !== 0) {
      return;
    }
    this.xeroAppService.getXeroAuthLink().subscribe(
      (res: any) => {
        window.open(res.url, 'xeroauth');
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

  getSubscriptionDetails() {
    this.loading = true;
    this.isDataFetchSuccess = false;
    const userId = this.authService.getLoggedInUserDetails().UserId;
    this.subscription.getActivePlan(userId).subscribe(
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
    const userId = this.authService.getLoggedInUserDetails().UserId;
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
    const userId = this.authService.getLoggedInUserDetails().UserId;

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
        setTimeout(() => {
          this.showStatus = false;
        }, 5000);
      }
    );
  }

  getDataLoadSteps() {
    const userId = this.authService.getLoggedInUserDetails().UserId;

    // if (this.showXeroDataLoadProcess) {
    this.subscription.getDataLoadSteps(userId).subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          this.dataLoadingSteps = res.data ? res.data : null;
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
    if (dataStatus['XERO-AUTH']) {
      if (dataStatus['XERO-AUTH'].isCompleted) {
        this.stepperIndex++;
      } else if (dataStatus['XERO-AUTH'].isError) {
        this.showError = true;
      }
    }

    if (dataStatus['isCompleted']) {
      if (dataStatus['isCompleted'].isCompleted) {
        this.stepperIndex++;
      } else if (dataStatus['isCompleted'].isError) {
        this.showError = true;
      }
    }

    if (dataStatus['DASHBOARD-CREATION']) {
      if (dataStatus['DASHBOARD-CREATION'].isCompleted) {
        this.stepperIndex++;
      } else if (dataStatus['DASHBOARD-CREATION'].isError) {
        this.showError = true;
      }
    }

    if (dataStatus['DATASET-REFRESH']) {
      if (dataStatus['DATASET-REFRESH'].isCompleted) {
        this.stepperIndex++;
      } else if (dataStatus['DATASET-REFRESH'].isError) {
        this.showError = true;
      }
    }

    if (dataStatus['INITIAL-LOAD-COMPLETE']) {
      if (dataStatus['INITIAL-LOAD-COMPLETE'].isCompleted) {
        this.stepperIndex++;
        this.showReportActive = true;
      } else if (dataStatus['INITIAL-LOAD-COMPLETE'].isError) {
        this.showError = true;
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
    return '';
  }

  refreshStepper() {
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
}
