import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalModule } from 'ngb-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { SummaryReportRoutingModule } from './summary-report-routing.module';

@NgModule({
  declarations: [SummaryReportComponent],
  imports: [
    CommonModule,
    SummaryReportRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
  ],
})
export class SummaryReportModule {}
