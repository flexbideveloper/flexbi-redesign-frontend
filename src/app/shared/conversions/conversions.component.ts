import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('scrollMe') private chatContainer: ElementRef;
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
    let message = this.messageForm.value.message;
    this.messageForm.get('message').setValue('');

    this.messageService.postConversion(message).subscribe((resp) => {
      this.messageForm.get('message').setValue('');

      if (resp.status === 200) {
        this.messageService.getConversions().subscribe((resp) => {
          this.messages = this.formateMessage(resp.data as any);
        });
      }
    });
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
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
