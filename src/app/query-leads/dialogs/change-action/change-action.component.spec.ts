import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeActionComponent } from './change-action.component';

describe('ChangeActionComponent', () => {
  let component: ChangeActionComponent;
  let fixture: ComponentFixture<ChangeActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ChangeActionComponent]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
