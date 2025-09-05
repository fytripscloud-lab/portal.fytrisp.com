import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateQuotationDialogComponent } from './create-quotation-dialog.component';

describe('CreateQuotationDialogComponent', () => {
  let component: CreateQuotationDialogComponent;
  let fixture: ComponentFixture<CreateQuotationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [CreateQuotationDialogComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuotationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
