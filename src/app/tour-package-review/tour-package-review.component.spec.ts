import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPackageReviewComponent } from './tour-package-review.component';

describe('TourPackageReviewComponent', () => {
  let component: TourPackageReviewComponent;
  let fixture: ComponentFixture<TourPackageReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourPackageReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourPackageReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
