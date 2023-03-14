import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import * as fromAppStore from '@app/core/store';
import { Store } from '@ngrx/store';
import * as pbi from 'powerbi-client';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';
import { IOrganisation } from 'src/app/interfaces/auth.interface';
import * as fromStore from '../store';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss'],
})
export class SummaryReportComponent {
  report: pbi.Embed;
  loading = true;
  public isNewUser: any = false;

  showStatus: boolean = false;
  messageStatus: string = 'success';
  alertMessage: string = '';

  pageList: any = [];
  visualList: any = [];
  tokenObj: any = null;

  public isTrialActivated: any = false;
  allVisuals: pbi.IVisualEmbedConfiguration[] = [];
  allPageVisual: pbi.IEmbedConfiguration[] = [];

  orglist$ = this.store.select(fromAppStore.selectOrgLists);
  isAdvisor$ = this.store.select(fromAppStore.isAdvisor);

  reportDetails$ = this.store.select(fromStore.selectSummaryData);
  isLoading$ = this.store.select(fromStore.selectSummaryLoading);

  form: FormGroup;
  selectionChanged$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(
    private store: Store<fromStore.IReportState>,
    private fb: FormBuilder
  ) {
    this.store.dispatch(fromStore.init());

    this.form = this.fb.group({
      orgId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    combineLatest(
      this.reportDetails$,
      this.isLoading$
    )
      .pipe(
        tap(([report, isLoading]) => {
  
          if (!!report && !isLoading) {
            let embedUrl = 'https://app.powerbi.com/reportEmbed';
            let pageSettings: pbi.IEmbedSettings = {
              filterPaneEnabled: false,
              navContentPaneEnabled: false,
            };
            let visualSettings: pbi.IEmbedSettings = {
              filterPaneEnabled: true,
              navContentPaneEnabled: true,
            };
            let embedReportId = report.tokenRes.embedUrl[0].reportId;

            this.pageList = report.pages;
            this.visualList = report.visuals;

            this.allPageVisual = this.pageList.map((p: any) => {
              let config: pbi.IEmbedConfiguration = {
                type: 'report',
                tokenType: pbi.models.TokenType.Embed,
                accessToken: report.tokenRes.accessToken,
                embedUrl: embedUrl,
                id: embedReportId,
                filters: [],
                settings: pageSettings,
                pageName: p.PageName,
                pageView: 'fitToWidth',
                // height : p.Height,
                // width : p.Width
              };
              return config;
            });

            this.allVisuals = this.visualList.map((v: any) => {
              let config: pbi.IVisualEmbedConfiguration = {
                type: 'visual',
                tokenType: pbi.models.TokenType.Embed,
                accessToken: report.tokenRes.accessToken,
                embedUrl: embedUrl,
                id: embedReportId,
                filters: [],
                settings: visualSettings,
                pageName: v.PageName,
                visualName: v.VisualName,
                // height : v.Height,
                // width : v.Width
              };
              return config;
            });
          }
        })
      )
      .subscribe();

    this.getOrgId.valueChanges
      .pipe(
        tap((id: number) => {
          this.onSearch(id);
        })
      )
      .subscribe();

      this.orglist$
      .pipe(
        tap((orgLists : IOrganisation[]) => {
          this.form.get('orgId').setValue(orgLists[0].orgId);
          this.store.dispatch(fromStore.setOrgId({ orgId : orgLists[0].orgId as number }));
        })
      )
      .subscribe();

  }

  onSearch(id:number): void {
      this.store.dispatch(fromStore.setOrgId({ orgId : id }));
  }

  get getOrgId(): AbstractControl {
    return this.form.get('orgId') as AbstractControl;
  }
}
