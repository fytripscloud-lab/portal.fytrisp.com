import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripFaqComponent } from './trip-faq.component';

describe('TripFaqComponent', () => {
  let component: TripFaqComponent;
  let fixture: ComponentFixture<TripFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
