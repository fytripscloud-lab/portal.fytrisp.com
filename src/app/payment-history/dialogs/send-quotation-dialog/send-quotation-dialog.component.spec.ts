import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendQuotationDialogComponent } from './send-quotation-dialog.component';

describe('SendQuotationDialogComponent', () => {
  let component: SendQuotationDialogComponent;
  let fixture: ComponentFixture<SendQuotationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SendQuotationDialogComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendQuotationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
