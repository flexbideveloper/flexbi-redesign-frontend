import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { ModalModule } from 'ngb-modal';
import { CompanyNameComponent } from './company-name/company-name.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AcceptPaymentPromptComponent } from './accept-payment-prompt/accept-payment-prompt.component';

@NgModule({
  declarations: [SubscriptionsComponent, CompanyNameComponent, AcceptPaymentPromptComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SubscriptionsModule {}
