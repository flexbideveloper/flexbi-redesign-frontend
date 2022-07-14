import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-accept-payment-prompt',
  templateUrl: './accept-payment-prompt.component.html',
  styleUrls: ['./accept-payment-prompt.component.scss'],
})
export class AcceptPaymentPromptComponent implements OnInit {
  @Input() planRequest: {
    userId: string;
    CompanyName: string;
    PlanName: string;
    PlanAmount: number;
    PlanId: string;
  };

  paymentObj: any = {
    paymentURL: '',
    isRedirectToPayment: false,
  };
  constructor(
    private subscription: SubcriptionsService,
    private notifcation: NotificationService,
    private sanitizer: DomSanitizer,
    private model: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getSharedPaymentURL();
  }

  getSharedPaymentURL() {
    this.subscription
      .getSharedPaymentURL({
        userId: this.planRequest.userId,
        PlanId: this.planRequest.PlanId,
      })
      .subscribe(
        (data: any) => {
          if (data.status === 500) {
            // this.loading = false;
            // this.messageStatus = 'danger';
            // this.showStatus = true;
            // this.alertMessage = data.message + ' (' + data.errorMessage + ')';
            // this.paymentObj.RedirectURL = '';
            // this.paymentObj.isRedirectToPayment = false;
            this.notifcation.error(
              data.message + ' (' + data.errorMessage + ')'
            );
          } else {
            this.paymentObj.RedirectURL =
              this.sanitizer.bypassSecurityTrustResourceUrl(data.redirectURL);
            this.paymentObj.isRedirectToPayment = true;
            // window.open(data.redirectURL, '_blank', 'toolbar=0,location=0,menubar=0');
          }
        },
        (res: any) => {
          // this.loading = false;
          // this.messageStatus = 'danger';
          // this.showStatus = true;
          // this.alertMessage = 'Payment Failure...';
          // this.paymentObj.RedirectURL = '';
          // this.paymentObj.isRedirectToPayment = false;
          this.model.close();
          this.notifcation.error('Payment Failure...');
        }
      );
  }
}

// https://flexbi-xeroapi.australiaeast.cloudapp.azure.com/pages/subscriptions
// ?isTranComplete=true&
// planId=2&
// AccessCode=A10012aTKtpB8h8tkhHlaDmXZ05K0zMLAWyAzu-c1MyMYy3UPD-TgDP1qgoRPTv739Q1ial9sKhmOvHdIqlZhUZsIUt-dTdDNFf6JHOq5Bar0Md3vwVoCA7JfdobwW61kQhepZ8AXRPKVKFpOlo2s20V3vQ==
