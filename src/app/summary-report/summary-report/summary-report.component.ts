import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as pbi from 'powerbi-client';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import {
  ReportService,
} from 'src/app/services/report.service';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss'],
})
export class SummaryReportComponent implements OnInit {
  report: pbi.Embed;
  @ViewChild('estimatedCashflow', { static: false }) estimatedCashflow: ElementRef;
  @ViewChild('estimatedCreditor', { static: false }) estimatedCreditor: ElementRef;
  @ViewChild('estimatedDebitor', { static: false }) estimatedDebitor: ElementRef;
  @ViewChild('debtorStrength', { static: false }) debtorStrength: ElementRef;
  @ViewChild('creditorStrength', { static: false }) creditorStrength: ElementRef;
  @ViewChild('keyInsights', { static: false }) keyInsights: ElementRef;
  @ViewChild('rolling12Months', { static: false }) rolling12Months: ElementRef;

  loading = false;

  public isNewUser: any = false;

  showStatus: boolean = false;
  messageStatus: string = 'success';
  alertMessage: string = '';

  pageList: any = [];
  visualList: any = [];
  tokenObj: any = null;

  public isTrialActivated: any = false;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationService
  ) {
    this.getVisualsAndPages();
  }

  ngOnInit() {

  }

  getVisualsAndPages() {
    this.reportService.getPageVisuals().subscribe((data: any) => {
      if (data.status === 200) {
        this.pageList = data.pages;
        this.visualList = data.visuals;
        this.tokenObj = data.tokenRes;

        let embedUrl = 'https://app.powerbi.com/reportEmbed';
        let embedReportId = this.tokenObj.embedUrl[0].reportId;
        let visualSettings: pbi.IEmbedSettings = {
          filterPaneEnabled: true,
          navContentPaneEnabled: true,
        };

        this.visualList.map((v: any) => {
          let config: pbi.IVisualEmbedConfiguration = {
            type: 'visual',
            tokenType: pbi.models.TokenType.Embed,
            accessToken: this.tokenObj.accessToken,
            embedUrl: embedUrl,
            id: embedReportId,
            filters: [],
            settings: visualSettings,
            pageName: v.PageName,
            visualName: v.VisualName
          };

          let containerElement: any = null;
          switch(v.VisualDisplayName) {
            case 'Estimated Cashflow': {
              containerElement = this.estimatedCashflow.nativeElement;
              break;
            }
            case 'Estimated Debtor': {
              containerElement = this.estimatedDebitor.nativeElement;
              break;
            }
            case 'Estimated Creditor': {
              containerElement = this.estimatedCreditor.nativeElement;
              break;
            }
            case 'Debtor Strength': {
              containerElement = this.debtorStrength.nativeElement;
              break;
            }
            case 'Creditor Strength': {
              containerElement = this.creditorStrength.nativeElement;
              break;
            }
          }

          let powerbi = new pbi.service.Service(
            pbi.factories.hpmFactory,
            pbi.factories.wpmpFactory,
            pbi.factories.routerFactory
          );
          this.report = powerbi.embed(containerElement, config);
          this.report.off('loaded');

          this.report.on('loaded', () => {
            // this.setTokenExpirationListener(Token.expiration, 2);
          });
          this.report.on('error', () => {
            console.log('Error');
            this.notification.error('Report not loaded.');
          });
        });

        let pageSettings: pbi.IEmbedSettings = {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
        };
        this.pageList.map((p: any) => {
          let config: pbi.IEmbedConfiguration = {
            type: 'report',
            tokenType: pbi.models.TokenType.Embed,
            accessToken: this.tokenObj.accessToken,
            embedUrl: embedUrl,
            id: embedReportId,
            filters: [],
            settings: pageSettings,
            pageName: p.PageName,
            pageView: 'fitToWidth'
          };

          let containerElement: any = null;
          switch(p.PageDisplayName) {
            case 'Key Insights': {
              containerElement = this.keyInsights.nativeElement;
              break;
            }
            case 'Rolling 12 months': {
              containerElement = this.rolling12Months.nativeElement;
              break;
            }
          }

          let powerbi = new pbi.service.Service(
            pbi.factories.hpmFactory,
            pbi.factories.wpmpFactory,
            pbi.factories.routerFactory
          );
          this.report = powerbi.embed(containerElement, config);
          this.report.off('loaded');

          this.report.on('loaded', () => {
            // this.setTokenExpirationListener(Token.expiration, 2);
          });
          this.report.on('error', () => {
            console.log('Error');
            this.notification.error('Report not loaded.');
          });
        });
      }
    });
  }
}
