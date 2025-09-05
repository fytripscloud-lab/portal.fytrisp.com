import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendPaymentDialogComponent } from './send-payment-dialog.component';

describe('SendPaymentDialogComponent', () => {
  let component: SendPaymentDialogComponent;
  let fixture: ComponentFixture<SendPaymentDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SendPaymentDialogComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
