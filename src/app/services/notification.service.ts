import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(msg: string) {
    this.toastr.success('Success', msg);
  }

  error(msg: string) {
    this.toastr.error('Error', msg);
  }
}
