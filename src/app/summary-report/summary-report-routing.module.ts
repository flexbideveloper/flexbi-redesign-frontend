import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportAppResolver } from '@app/core/store/resolvers/student-common-app-info.resolver';
import { SummaryReportComponent } from './summary-report/summary-report.component';

const routes: Routes = [
  {
    path: '',

    resolve: {
      reportInfo: ReportAppResolver,
    },
    component: SummaryReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryReportRoutingModule {}
