import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrapesEditorComponent } from './grapes-editor.component';

describe('GrapesEditorComponent', () => {
  let component: GrapesEditorComponent;
  let fixture: ComponentFixture<GrapesEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrapesEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrapesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
