import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PowerBIEmbedModule } from 'powerbi-client-angular';

import { ModalModule } from 'ngb-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { SummaryReportRoutingModule } from './summary-report-routing.module';
import { VisualEmbedModule } from '../visual-embed/visual-embed.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SummaryReportComponent],
  imports: [
    CommonModule,
    SummaryReportRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
    VisualEmbedModule,
    PowerBIEmbedModule,
    SharedModule,
  ],
})
export class SummaryReportModule {}
