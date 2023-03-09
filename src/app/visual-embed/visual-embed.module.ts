import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualComponent } from './containers/visual/visual.component';
import { ReportPageComponent } from './containers/report-page/report-page.component';

@NgModule({
  declarations: [VisualComponent, ReportPageComponent],
  imports: [
    CommonModule
  ],
  exports: [VisualComponent, ReportPageComponent],
})
export class VisualEmbedModule { }
