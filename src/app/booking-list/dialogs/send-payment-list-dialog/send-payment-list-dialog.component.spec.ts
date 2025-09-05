import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendPaymentListDialogComponent } from './send-payment-list-dialog.component';

describe('SendPaymentDialogComponent', () => {
  let component: SendPaymentListDialogComponent;
  let fixture: ComponentFixture<SendPaymentListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SendPaymentListDialogComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPaymentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
