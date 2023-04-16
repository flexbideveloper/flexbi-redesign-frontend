import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WFMIntegrationComponent } from './wfm-integration/wfm-integration.component';

const routes: Routes = [{ path: '', component: WFMIntegrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionsRoutingModule {}
