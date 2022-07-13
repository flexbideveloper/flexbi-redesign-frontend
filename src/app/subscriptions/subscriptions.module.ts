import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';

@NgModule({
  declarations: [SubscriptionsComponent],
  imports: [CommonModule, SubscriptionsRoutingModule, NgbModule],
})
export class SubscriptionsModule {}
