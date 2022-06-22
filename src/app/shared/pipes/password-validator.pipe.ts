import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordValidator',
})
export class PasswordValidatorPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
