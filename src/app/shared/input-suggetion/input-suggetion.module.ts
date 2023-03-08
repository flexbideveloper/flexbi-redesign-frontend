import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBoxComponent } from './containers/input-box/input-box.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InputBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputBoxComponent
  ],
})
export class InputSuggetionModule { }
