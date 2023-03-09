import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
})
export class ReportPageComponent implements AfterViewInit {
  @ViewChild('reportContainer', { static: true }) reportContainer: ElementRef;
  @Input() reportId: string;
  @Input() pageItem: pbi.IVisualEmbedConfiguration;
  @Input() height:number;
  @Input() width:number;
  @Input() padding:number = 0;

  
  embedUrl = 'https://app.powerbi.com/reportEmbed';
  report: pbi.Embed;

  @Input() config: pbi.IVisualEmbedConfiguration;
  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    let that = this;
    let container:any = that.reportContainer;
 
    this.report = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    ).embed(container.nativeElement, that.pageItem);

    this.report.off('loaded');

    this.report.on('loaded', () => {
      // this.setTokenExpirationListener(Token.expiration, 2);
    });
    this.report.on('error', () => {
      console.log('Error');
      // this.notification.error('Report not loaded.');
    });

  }

}
