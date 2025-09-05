import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLogDialogComponent } from './payment-log-dialog.component';

describe('StatusLogDialogComponent', () => {
  let component: PaymentLogDialogComponent;
  let fixture: ComponentFixture<PaymentLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentLogDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
