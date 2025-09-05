import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedPaymentComponent } from './completed-payment.component';

describe('CompletedPaymentComponent', () => {
  let component: CompletedPaymentComponent;
  let fixture: ComponentFixture<CompletedPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
