import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHistoryDialogComponent } from './login-history-dialog.component';

describe('ViewDialogComponent', () => {
  let component: LoginHistoryDialogComponent;
  let fixture: ComponentFixture<LoginHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
