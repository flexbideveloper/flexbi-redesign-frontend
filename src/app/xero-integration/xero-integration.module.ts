import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionsRoutingModule } from './xero-integration-routing.module';
import { ModalModule } from 'ngb-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { XeroIntegrationComponent } from './xero-integration/xero-integration.component';

@NgModule({
  declarations: [XeroIntegrationComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
  ],
})
export class XeroIntegrationModule {}
