import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPaymentPromptComponent } from './accept-payment-prompt.component';

describe('AcceptPaymentPromptComponent', () => {
  let component: AcceptPaymentPromptComponent;
  let fixture: ComponentFixture<AcceptPaymentPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptPaymentPromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptPaymentPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
