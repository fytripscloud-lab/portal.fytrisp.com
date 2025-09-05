import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterHotelsComponent } from './master-hotels.component';

describe('MasterHotelsComponent', () => {
  let component: MasterHotelsComponent;
  let fixture: ComponentFixture<MasterHotelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterHotelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
