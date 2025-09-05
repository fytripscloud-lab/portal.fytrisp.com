import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRouteComponent } from './master-route.component';

describe('MasterRouteComponent', () => {
  let component: MasterRouteComponent;
  let fixture: ComponentFixture<MasterRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
