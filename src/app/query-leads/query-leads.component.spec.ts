import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLeadsComponent } from './query-leads.component';

describe('QueryLeadsComponent', () => {
  let component: QueryLeadsComponent;
  let fixture: ComponentFixture<QueryLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryLeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
