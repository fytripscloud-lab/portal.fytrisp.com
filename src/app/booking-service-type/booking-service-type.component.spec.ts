import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingServiceTypeComponent } from './booking-service-type.component';

describe('BookingServiceProviderComponent', () => {
  let component: BookingServiceTypeComponent;
  let fixture: ComponentFixture<BookingServiceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingServiceTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
