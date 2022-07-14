import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SubcriptionsService } from 'src/app/services/subscription.service';

export interface ConfirmAction {
  text: string;
  callback(): void;
}

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss'],
})
export class CompanyNameComponent implements OnInit {
  form: FormGroup;
  @Input() user_id: string;

  @Input() confirmText: string;
  @Input() yesAction: ConfirmAction;
  @Input() noAction: ConfirmAction;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private subscription: SubcriptionsService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      CompanyName: ['', Validators.required],
      userId: [this.user_id],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.subscription.addCompanyName(this.form.value).subscribe(
      (data: any) => {
        if (data.status === 200) {
          const userDetails = this.authService.getLoggedInUserDetails();
          userDetails.CompanyName = this.form.value.CompanyName;
          this.authService.setLoggedInUserDetails(userDetails);
        }
      },
      (res: any) => {
        this.notification.error(res.message);
        this.modelClose();
      }
    );
  }

  modelClose() {
    this.modal.close();
  }
}
