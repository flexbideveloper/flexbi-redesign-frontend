import { Component, Input, OnInit } from '@angular/core';
import { IMessage, MessageService } from 'src/app/services/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  replyBtn: boolean = false;
  loadRecord: boolean = false;
  randomId = Math.floor(Math.random() * 10000)
  @Input() message: IMessage;
  @Input() id: string;
  messageForm: FormGroup;
  innerMessages: IMessage[] = [];
  label: string;
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      Message: ['', Validators.required],
      id_FkParentMessage: [parseInt(this.message.MessageID)],
    });
    this.label = this.message.CountLabel;
  }

  loadMessage() {
    if (this.replyBtn) {
      this.loadRecord = true;
      this.messageService
        .getConversionsMessageById(this.message.MessageID)
        .subscribe(
          (resp) => {
            if (resp.status === 200) {
              this.innerMessages = resp.data;
              this.loadRecord = false;
            }
          },
          (error) => {
            this.loadRecord = false;
          }
        );
    }
  }

  sendMesage() {
    if (this.messageForm.invalid) {
      return;
    }
    this.messageService
      .postConversionById(this.messageForm.value)
      .subscribe((resp) => {
        if (resp.status === 200) {
          this.label = resp.data.CountLabel;
          this.innerMessages.push(resp.data);
          this.messageForm.get('Message').setValue('');
        }
      });
  }
}
