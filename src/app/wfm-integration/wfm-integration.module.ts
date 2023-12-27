import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionsRoutingModule } from './wfm-integration-routing.module';
import { ModalModule } from 'ngb-modal';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { WFMIntegrationComponent } from './wfm-integration/wfm-integration.component';

@NgModule({
  declarations: [WFMIntegrationComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class WFMIntegrationModule {}
