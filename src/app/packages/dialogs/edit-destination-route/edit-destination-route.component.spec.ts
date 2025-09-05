import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDestinationRouteComponent } from './edit-destination-route.component';

describe('EditDestinationRouteComponent', () => {
  let component: EditDestinationRouteComponent;
  let fixture: ComponentFixture<EditDestinationRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDestinationRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDestinationRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
