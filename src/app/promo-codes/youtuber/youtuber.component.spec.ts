import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutuberComponent } from './youtuber.component';

describe('YoutuberComponent', () => {
  let component: YoutuberComponent;
  let fixture: ComponentFixture<YoutuberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutuberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutuberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
