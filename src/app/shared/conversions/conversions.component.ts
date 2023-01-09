import { Component, OnInit } from '@angular/core';
import { IMessage, MessageService } from 'src/app/services/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  messages: IMesageDateFormate[] = [];

  messageForm: FormGroup;
  constructor(private messageService: MessageService, private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required],
    });
    this.getConversion();
  }

  getConversion() {
    this.messageService.getConversions().subscribe((resp) => {
      this.messages = this.formateMessage(resp.data as any);
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
    this.messageService
      .postConversion(this.messageForm.value.message)
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.messageService.getConversions().subscribe((resp) => {
            this.messages = this.formateMessage(resp.data as any);
          });
        }
      });
  }

  formateMessage(data: IGetMessages[]): IMesageDateFormate[] {
    if (!data) {
      return [];
    }
    let keysData = Object.keys(data);
    let arrData = keysData.map((key: string) => ({
      title: key,
      data: data[key],
    }));
    return arrData;
  }
}
