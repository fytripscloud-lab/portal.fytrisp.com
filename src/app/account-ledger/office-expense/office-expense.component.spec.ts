import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeExpenseComponent } from './office-expense.component';

describe('OfficeExpenseComponent', () => {
  let component: OfficeExpenseComponent;
  let fixture: ComponentFixture<OfficeExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
