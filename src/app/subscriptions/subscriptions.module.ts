import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { ModalModule } from 'ngb-modal';
import { CompanyNameComponent } from './company-name/company-name.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SubscriptionsComponent, CompanyNameComponent],
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    NgbModule,
    ModalModule,
    ReactiveFormsModule,
  ],
})
export class SubscriptionsModule {}
