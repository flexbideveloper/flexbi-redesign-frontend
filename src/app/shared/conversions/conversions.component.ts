import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IMessage, MessageService } from 'src/app/services/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAppStore from '@app/core/store';
import * as fromReportStore from 'src/app/summary-report/store';
import { sendMessage } from 'src/app/summary-report/store';

export interface IGetMessages {
  [key: string]: IMessage[];
}
export interface IMesageDateFormate {
  title: string;
  data: IMessage[];
}

@Component({
  selector: 'app-conversions',
  templateUrl: './conversions.component.html',
  styleUrls: ['./conversions.component.scss'],
})
export class ConversionsComponent implements OnInit {
  isLoading$ = this.store.select(fromReportStore.selectMSGLoading);
  messages$ = this.store.select(fromReportStore.selectMSGData);

  users$ = this.store.select(fromReportStore.selectUsers);
  visuals$ = this.store.select(fromReportStore.selectVisuals);
  @ViewChild('scrollMe') private chatContainer: ElementRef;

  messageForm: FormGroup;
  constructor(private fb: FormBuilder, private store: Store) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    $('.switcher-btn').on('click', function () {
      $('.switcher-wrapper').toggleClass('switcher-toggled');
    });
    $('.close-switcher').on('click', function () {
      $('.switcher-wrapper').removeClass('switcher-toggled');
    });
  }

  sendMesage() {
    if (this.messageForm.invalid) {
      return;
    }
    let message = this.messageForm.value.message;
    this.messageForm.get('message').setValue('');
    this.store.dispatch(fromReportStore.sendMessage({ message }));
    // this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }
}
