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
  allVisuals : pbi.IVisualEmbedConfiguration[]= [];
  allPageVisual : pbi.IEmbedConfiguration[]= []

  constructor(
    private reportService: ReportService,
  ) {
    this.getVisualsAndPages();
  }

  getVisualsAndPages() {
    this.loading = true;
    this.reportService.getPageVisuals().subscribe((data: any) => {
      if (data.status === 200) {
        this.pageList = data.pages;
        this.visualList = data.visuals;
        if(this.visualList.length){
          this.loading = false
        }
        this.tokenObj = data.tokenRes;
        let embedUrl = 'https://app.powerbi.com/reportEmbed';
        let embedReportId = this.tokenObj.embedUrl[0].reportId;
        let visualSettings: pbi.IEmbedSettings = {
          filterPaneEnabled: true,
          navContentPaneEnabled: true,
        };

        this.allVisuals =  this.visualList.map((v: any) => {
          let config: pbi.IVisualEmbedConfiguration = {
            type: 'visual',
            tokenType: pbi.models.TokenType.Embed,
            accessToken: this.tokenObj.accessToken,
            embedUrl: embedUrl,
            id: embedReportId,
            filters: [],
            settings: visualSettings,
            pageName: v.PageName,
            visualName: v.VisualName,
            // height : v.Height,
            // width : v.Width
          };
          return config
        });

        let pageSettings: pbi.IEmbedSettings = {
          filterPaneEnabled: false,
          navContentPaneEnabled: false,
        };
        this.allPageVisual =    this.pageList.map((p: any) => {
          let config: pbi.IEmbedConfiguration = {
            type: 'report',
            tokenType: pbi.models.TokenType.Embed,
            accessToken: this.tokenObj.accessToken,
            embedUrl: embedUrl,
            id: embedReportId,
            filters: [],
            settings: pageSettings,
            pageName: p.PageName,
            pageView: 'fitToWidth',
            // height : p.Height,
            // width : p.Width
          };
          return config
        });
      }
    });
  }
}
