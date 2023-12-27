import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReportService } from 'src/app/services/report.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';
import { interval, Subscription, BehaviorSubject, combineLatest, tap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-wfm-integration',
  templateUrl: './wfm-integration.component.html',
  styleUrls: ['./wfm-integration.component.scss'],
})
export class WFMIntegrationComponent implements OnInit {
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
  tenantList: any = null;

  showError: boolean = false;
  active: string = 'auth';

  sub: Subscription;
  form: FormGroup;
  selectionChanged$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  allDataLoadComplete: any = false;
  failedDataLoad: any = false;
  dataLoadNotStarted: any = false;
  source = interval(5000);
  selectedTenantId: any = null;
  anotherDataLoadIsInProgress: any = false;

  constructor(
    private xeroAppService: ReportService,
    private notification: NotificationService,
    public authService: AuthService,
    public subscription: SubcriptionsService,
    public router: Router,
    public reportService: ReportService,
    private fb: FormBuilder
  ) {
    // this.form = this.fb.group({
    //   TenantId: [null, Validators.required],
    // });
    this.getTenantList();
    this.getSubscriptionDetails();
    setTimeout(() => {
      const newsource1 = interval(5000);
      const newsub1 = newsource1.subscribe((val) => this.checkForOtherLoading());
    }, 500);
  }

  ngOnInit(): void {
    // this.getTenantId.valueChanges
    //   .pipe(
    //     tap((id: any) => {
    //       this.onSearch(id);
    //     })
    //   )
    //   .subscribe();
    // this.sub = this.source.subscribe((val) => this.refreshStepper());
    this.refreshStepper()
  }

  getReport() {}

  checkForOtherLoading(): any {
    
    // disable button check
    this.subscription.checkForOtherLoading({
      userId: this.authService.getLoggedInUserDetails().OrgId,
      type: "XERO"
    }).subscribe((res: any)=> { 
      if (res && res.status === 200) {
        this.anotherDataLoadIsInProgress = res.isDataLoading;
      }
      return false;
    })
    
  }

  onSearch(event:any): void {
    this.resetDataLoadSteps();
    console.log(event.target.value);
    const orgId = this.authService.getLoggedInUserDetails().OrgId;
    this.subscription.checkForTenantDataLoad(this.selectedTenantId, orgId).subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          this.allDataLoadComplete = res.allDataLoadComplete;
          this.failedDataLoad = res.failedDataLoad;
          this.dataLoadNotStarted = res.dataLoadNotStarted;
        } else {
          this.allDataLoadComplete = res.allDataLoadComplete;
          this.failedDataLoad = res.failedDataLoad;
          this.dataLoadNotStarted = res.dataLoadNotStarted;
        }
        this.selectedTenantId !== null && this.checkDataLoadProcess();
      });
  }

  getTenantList() {
    const orgId = this.authService.getLoggedInUserDetails().OrgId;
    orgId && this.subscription.getTenantList(orgId).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.data.length > 0) {
          this.tenantList = res.data;
          // if(this.selectedTenantId === null)
          //   this.selectedTenantId = this.tenantList[0].TenantId;
        }
    });
  }

  refreshStepperFromUI() {
    this.sub && this.sub !== null && this.sub.unsubscribe();
    setTimeout(() => {
      const newsource = interval(5000);
      const newsub = newsource.subscribe((val) => this.refreshStepper());
    }, 500);
  }

  getWFMBtnLink() {
    this.sub && this.sub !== null && this.sub.unsubscribe();
    if (this.allDataLoadComplete || this.stepperIndex === 1 && !this.isTokenPrsent) {
      this.xeroAppService.getWFMBtnLink().subscribe(
        (res: any) => {
          
          window.open(res.url, 'wfmauth');
          // this.showXeroDataLoadProcess = true;
          this.loading = false;
          this.refreshStepperFromUI();
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
            this.getTenantList();
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
    this.subscription.checkDataLoadProcess(userId, this.selectedTenantId, "WFM").subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          if (res.isErrorInDataLoad) {
            // call the data load process and steps
            this.showXeroDataLoadProcess = true;
             
          this.failedDataLoad 
          this.dataLoadNotStarted
            if (!this.allDataLoadComplete && !this.failedDataLoad && !this.dataLoadNotStarted)
              this.refreshStepperFromUI()
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
    this.subscription.getXeroAccessTokenDetails(userId, "WFM").subscribe(
      (res: any) => {
        if (res && res.isTokenPrsent) {
          this.isTokenPrsent = res.isTokenPrsent;
          // this.router.navigate(['subscriptions']);
          // this.getTenants();
          this.selectedTenantId !== null && this.getDataLoadSteps();
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
    this.subscription.getWFMDataLoadSteps(userId, this.selectedTenantId).subscribe(
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

  resetDataLoadSteps() {
    const dataStatus = {
      "WFM-AUTH": {
        isCompleted: false,
        isError: false,
        error: "",
      },
      "WFM-DATA-LOAD": {
        isCompleted: false,
        isError: false,
        error: "",
      },
      "WFM-DATA-UPLOAD": {
        isCompleted: false,
        isError: false,
        error: "",
      },
      "INITIAL-LOAD-COMPLETE": {
        isCompleted: false,
        isError: false,
        error: "",
      }
    }
    this.checkStepsAndPassStepper(dataStatus);
  }

    checkStepsAndPassStepper(dataStatus: any) {
    if (dataStatus['WFM-AUTH']) {
      if (dataStatus['WFM-AUTH'].isCompleted) {
        this.stepperIndex = 2;
      } else if (dataStatus['WFM-AUTH'].isError) {
        this.showError = true;
        this.errorText = dataStatus['WFM-AUTH'].error;
        this.active == 'load';
        this.allDataLoadComplete = false;
        this.failedDataLoad = true;
        this.dataLoadNotStarted = false;
      }
    }

    if (dataStatus['WFM-DATA-LOAD']) {
      if (dataStatus['WFM-DATA-LOAD'].isCompleted) {
        this.stepperIndex = 3;
      } else if (dataStatus['WFM-DATA-LOAD'].isError) {
        this.showError = true;
        this.errorText = dataStatus['WFM-DATA-LOAD'].error;
        this.active == 'creation';
        this.allDataLoadComplete = false;
        this.failedDataLoad = true;
        this.dataLoadNotStarted = false;
      }
    }

    if (dataStatus['WFM-DATA-UPLOAD']) {
      if (dataStatus['WFM-DATA-UPLOAD'].isCompleted) {
        this.stepperIndex = 4;
      } else if (dataStatus['WFM-DATA-UPLOAD'].isError) {
        this.showError = true;
        this.errorText = dataStatus['WFM-DATA-UPLOAD'].error;
        this.active == 'creation';
        this.allDataLoadComplete = false;
        this.failedDataLoad = true;
        this.dataLoadNotStarted = false;
      }
    }

    if (dataStatus['INITIAL-LOAD-COMPLETE']) {
      if (dataStatus['INITIAL-LOAD-COMPLETE'].isCompleted) {
        this.stepperIndex = 5;
        this.showReportActive = true;
        this.allDataLoadComplete = true;
        this.failedDataLoad = false;
        this.dataLoadNotStarted = false;
        this.getTenantList();
        // window.location.reload();
        this.sub.unsubscribe();
      } else if (dataStatus['INITIAL-LOAD-COMPLETE'].isError) {
        this.showError = true;
        this.errorText = dataStatus['INITIAL-LOAD-COMPLETE'].error;
        this.active == 'final';
        this.allDataLoadComplete = false;
        this.failedDataLoad = true;
        this.dataLoadNotStarted = false;
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
    this.selectedTenantId !== null && this.getDataLoadSteps();
    this.getTenantList();
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

  get getTenantId(): AbstractControl {
    return this.form.get('TenantId') as AbstractControl;
  }
}
