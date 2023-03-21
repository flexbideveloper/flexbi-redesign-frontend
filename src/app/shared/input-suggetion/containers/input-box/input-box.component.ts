export interface IVisual {
  VisualName: string;
  VisualDisplayName: string;
  visualId: number;
}

export interface IUser {
  userId: number;
  UserName: string;
  Email: string;
  IsAdvisor: 0 | 1;
}

import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  AfterViewInit,
  HostBinding,
  forwardRef,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputBoxComponent),
      multi: true,
    },
  ],
})
export class InputBoxComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  public sizeValue;
  public idInputValue;
  public nameValue;
  public inputTypeValue;
  public uiTypeValue;
  public initialId = uuidv4();
  prefixUser = '@';
  prefixVisual = '#';
  @Output() dataInputChange = new EventEmitter<string>();
  @Output() onInputBlur = new EventEmitter();
  @Output() onInputFocus = new EventEmitter();
  @Output() onSearch = new EventEmitter();
  @Output() onPressEnter = new EventEmitter();
  @Output() onClear = new EventEmitter();

  @Input() dataInput: string;
  @Input() size?: string;
  @Input() uiType?: string;
  @Input() idInput?: string;
  @Input() label?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() searchSvg?: boolean = false;
  @Input() clearSvg?: boolean = false;
  @Input() required?: boolean = false;
  @Input() inputFocus?: boolean = false;
  @Input() errorMsg?: string;
  @Input() inputType?: string;
  @Input() disabled?: boolean;
  @Input() autocomplete?: string;

  @Input() userList: IUser[] = [];
  @Input() visualList: IVisual[] = [];

  errorRequired: string | null = null;
  @ViewChildren('InputField') InputField: ElementRef;

  @HostBinding('class.disabled')
  @HostBinding('attr.disabled')
  public get isDisabled(): boolean {
    return this.disabled;
  }
  public set isDisabled(value: boolean) {
    this.setDisabledState(value);
  }

  userDropdownShow: boolean = false;
  visualDropdownShow: boolean = false;
  focusOut: boolean = true;

  ngOnInit() {
    this.dataInput = this.dataInput ?? '';
    this.idInputValue = this.idInput || this.initialId;
    this.nameValue = this.name || this.initialId;
  }

  ngOnChanges({ size, idInput, name, inputType, uiType }: SimpleChanges) {
    // if (size) {
    //   this.sizeValue = CLASSES_UI_SYZE[this.size] || DEFAULT.SIZE;
    // }
    if (idInput) {
      this.idInputValue = this.idInput || this.initialId;
    }
    if (name) {
      this.nameValue = this.name || this.initialId;
    }
    // if (inputType) {
    //   this.inputTypeValue = TYPE_INPUT[this.inputType] || TYPE_INPUT.text;
    // }
    // if (uiType) {
    //   this.uiTypeValue = CLASSES_UI_TYPE[this.uiType] || DEFAULT.UI_TYPE;
    // }
  }

  ngAfterViewInit() {
    if (this.inputFocus) {
      this.InputField['first'].nativeElement.focus();
    }
  }

  onChange(event) {}

  registerOnChange(fn) {
    this.onChange = fn;
  }

  onTouched() {
    debugger;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled || false;
  }

  writeValue(value: string): void {
    this.dataInput = value;
  }

  enterPress(): void {
    if (this.required && !this.isNotEmpty(this.dataInput)) {
      return;
    }
    this.onPressEnter.emit(this.dataInput);
  }

  isNotEmpty(value: string): boolean {
    return !!(value && value.trim().length);
  }

  errorRequiredFunc(value: string): void {
    if (!this.isNotEmpty(value) && this.required) {
      this.errorRequired = 'This field is required!';
      return;
    }
    this.errorRequired = null;
  }

  onBlur(): void {
    // this.userDropdownShow = false;
    // this.visualDropdownShow = false;
    this.onTouched();
    this.onInputBlur.emit();
    this.errorRequiredFunc(this.dataInput);
  }

  onFocus(): void {
    let str = this.dataInput;
    let lastChar = str.charAt(str.length - 1);
    if (lastChar === '@') {
      this.userDropdownShow = true;
    } else {
      this.userDropdownShow = false;
    }
    if (lastChar === '#') {
      this.visualDropdownShow = true;
    } else {
      this.visualDropdownShow = false;
    }
    this.focusOut = false;

    this.onInputFocus.emit();
  }

  keyDown(event: KeyboardEvent): void {
    // if (event.charCode === 64) {
    //   this.userDropdownShow = true;
    // } else {
    //   this.userDropdownShow = false;
    // }

    // if (event.charCode === 35) {
    //   this.visualDropdownShow = true;
    // } else {
    //   this.visualDropdownShow = false;
    // }

    if (event.charCode === 0) {
      this.visualDropdownShow = false;
      this.visualDropdownShow = false;
    }

    let data = this.dataInput.split(' ');

    if (data.length >= 0) {
      let lastWord = data[data.length - 1];
      if (lastWord.length > 1 && lastWord.lastIndexOf('@') >= 0) {
        this.userDropdownShow = true;
      } else {
        this.userDropdownShow = false;
      }

      if (lastWord.length > 1 && lastWord.lastIndexOf('#') >= 0) {
        this.visualDropdownShow = true;
      } else {
        this.visualDropdownShow = false;
      }
    } else {
      this.userDropdownShow = false;
      this.visualDropdownShow = false;
    }
  }

  onInputChange(value: string): void {
    this.dataInput = value;
    this.dataInputChange.emit(value);
    this.onChange(value);
    this.onTouched();
    this.errorRequiredFunc(value);
  }

  escPress() {
    this.userDropdownShow = false;
    this.visualDropdownShow = false;
  }

  keyPress(event: KeyboardEvent) {
    if (event.charCode === 64) {
      this.userDropdownShow = true;
    } else {
      this.userDropdownShow = false;
    }

    if (event.charCode === 35) {
      this.visualDropdownShow = true;
    } else {
      this.visualDropdownShow = false;
    }
  }

  selectUser(user: IUser) {
    let value = user.UserName;
    this.dataInput = this.dataInput + value + ' ';
    this.userDropdownShow = false;
    this.dataInputChange.emit(this.dataInput);
    this.onChange(this.dataInput);
    this.onTouched();
    this.errorRequiredFunc(this.dataInput);
  }

  selectVisual(visual: IVisual) {
    this.visualDropdownShow = false;
    let value = visual.VisualDisplayName;
    this.dataInput = this.dataInput + value + ' ';
    this.userDropdownShow = false;
    this.dataInputChange.emit(this.dataInput);
    this.onChange(this.dataInput);
    this.onTouched();
    this.errorRequiredFunc(this.dataInput);
  }

  onSearchClick(): void {
    if (this.disabled) {
      return;
    }
    if (this.required && !this.isNotEmpty(this.dataInput)) {
      this.onTouched();
      this.errorRequiredFunc(this.dataInput);
      return;
    }
    this.onSearch.emit();
  }

  onClearClick(): void {
    if (this.disabled) {
      return;
    }
    this.dataInput = '';
    this.onClear.emit();
  }
}
