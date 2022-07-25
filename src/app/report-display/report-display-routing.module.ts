import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDisplayComponent } from './report-display/report-display.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDisplayComponent,
  },
  {
    path: ':reportId/:workspaceId/:xeroReport',
    component: ReportDisplayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportDisplayRoutingModule {}
