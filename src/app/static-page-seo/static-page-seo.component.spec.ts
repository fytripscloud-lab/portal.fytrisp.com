import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticPageSeoComponent } from './static-page-seo.component';

describe('StaticPageSeoComponent', () => {
  let component: StaticPageSeoComponent;
  let fixture: ComponentFixture<StaticPageSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticPageSeoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticPageSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
