import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'passwordControl',
  pure: false,
})
export class PasswordControlPipe implements PipeTransform {
  transform(form: FormGroup, control: string, confirmShow = false): string {
    const { errors, value, touched } = form.controls[control];

    if (touched) {
      if (/^(\s)|(\s)+$/g.test(value)) {
        return 'Password cannot start or end with a white space';
      }

      if (errors['required'] && !confirmShow) {
        return 'Password is required.';
      }

      if (errors['required'] && confirmShow) {
        return 'Confirm Password is required.';
      }

      if (errors['minlength']) {
        return 'Password must be greater than 9 characters';
      }

      if (errors['maxlength']) {
        return 'Password must be less than 512 characters';
      }

      if (errors['pattern']['errorRepeatPassword'] && confirmShow) {
        return 'Password & Confirm password not match.';
      }
      console.log(errors);
    }

    if (!errors) {
      return null;
    }

    return null;
  }
}
