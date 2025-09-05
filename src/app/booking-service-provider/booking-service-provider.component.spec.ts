import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingServiceProviderComponent } from './booking-service-provider.component';

describe('BookingServiceProviderComponent', () => {
  let component: BookingServiceProviderComponent;
  let fixture: ComponentFixture<BookingServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingServiceProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingServiceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
