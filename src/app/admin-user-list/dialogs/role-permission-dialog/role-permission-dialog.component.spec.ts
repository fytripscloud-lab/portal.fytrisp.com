import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionDialogComponent } from './role-permission-dialog.component';

describe('RolePermissionDialogComponent', () => {
  let component: RolePermissionDialogComponent;
  let fixture: ComponentFixture<RolePermissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
