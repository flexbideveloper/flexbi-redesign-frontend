import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ConversionsComponent } from './conversions/conversions.component';
import { PasswordValidatorPipe } from './pipes/password-validator.pipe';
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component';
import { MessageComponent } from './message/message.component';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { InputSuggetionModule } from './input-suggetion/input-suggetion.module';


@NgModule({
  exports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConversionsComponent,
    NgbModule,
    AvatarPhotoComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    InputSuggetionModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ConversionsComponent,
    PasswordValidatorPipe,
    AvatarPhotoComponent,
    MessageComponent,
  ],
  providers: [],
})
export class SharedModule {}
