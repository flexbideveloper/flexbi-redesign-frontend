import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { IMessage, MessageService } from 'src/app/services/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromReportStore from 'src/app/summary-report/store';
import { tap } from 'rxjs';

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
export class ConversionsComponent implements OnInit, AfterViewInit {
  scrollHave: true;
  isLoading$ = this.store.select(fromReportStore.selectMSGLoading);
  messages$ = this.store.select(fromReportStore.selectMSGData);
  isChanged$ = this.store.select(fromReportStore.selectIsMessageChanged);

  users$ = this.store.select(fromReportStore.selectUsers);
  visuals$ = this.store.select(fromReportStore.selectVisuals);
  @ViewChild('scrollMe', { static: true }) scroll: any;

  messageForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    $('.switcher-btn').on('click', function () {
      $('.switcher-wrapper').toggleClass('switcher-toggled');
      var objDiv = document.getElementById('switcher-body');
      objDiv.scrollTop = objDiv.scrollHeight;
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
  }

  ngAfterViewInit(): void {
    var objDiv = document.getElementById('switcher-body');
    objDiv.scrollTop = objDiv.scrollHeight;
    this.isChanged$
      .pipe(
        tap((value: number) => {
          var objDiv = document.getElementById('switcher-body');
          objDiv.scrollTop = objDiv.scrollHeight;
        })
      )
      .subscribe();
  }
}
