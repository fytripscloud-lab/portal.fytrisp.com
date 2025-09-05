import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebLogsComponent } from './web-logs.component';

describe('WebLogsComponent', () => {
  let component: WebLogsComponent;
  let fixture: ComponentFixture<WebLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
