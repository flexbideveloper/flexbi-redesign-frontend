import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualComponent } from './containers/visual/visual.component';

@NgModule({
  declarations: [VisualComponent],
  imports: [
    CommonModule
  ],
  exports: [VisualComponent],
})
export class VisualEmbedModule { }
