import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusLogDialogComponent } from './status-log-dialog.component';

describe('StatusLogDialogComponent', () => {
  let component: StatusLogDialogComponent;
  let fixture: ComponentFixture<StatusLogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusLogDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
