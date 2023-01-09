import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.scss'],
})
export class VisualComponent implements AfterViewInit {
  @ViewChild('reportContainer', { static: true }) reportContainer: ElementRef;
  @Input() reportId: string;
  @Input() visualItem: pbi.IVisualEmbedConfiguration;
  @Input() height:number;
  @Input() width:number;
  embedUrl = 'https://app.powerbi.com/reportEmbed';
  report: pbi.Embed;

  @Input() config: pbi.IVisualEmbedConfiguration;
  constructor() {
  }

  ngAfterViewInit(): void {
    let that = this;
    let container:any = that.reportContainer;
 
    this.report = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    ).embed(container.nativeElement, that.visualItem);

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
