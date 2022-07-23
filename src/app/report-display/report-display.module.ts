import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalModule } from 'ngb-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportDisplayComponent } from './report-display/report-display.component';
import { ReportDisplayRoutingModule } from './report-display-routing.module';

@NgModule({
  declarations: [ReportDisplayComponent],
  imports: [
    CommonModule,
    ReportDisplayRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
  ],
})
export class ReportDisplayModule {}
