import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroIntegrationComponent } from './xero-integration/xero-integration.component';

const routes: Routes = [{ path: '', component: XeroIntegrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionsRoutingModule {}
