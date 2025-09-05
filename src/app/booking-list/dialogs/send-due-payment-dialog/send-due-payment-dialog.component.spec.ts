import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendDuePaymentDialogComponent } from './send-due-payment-dialog.component';

describe('SendDuePaymentDialogComponent', () => {
  let component: SendDuePaymentDialogComponent;
  let fixture: ComponentFixture<SendDuePaymentDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SendDuePaymentDialogComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendDuePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
