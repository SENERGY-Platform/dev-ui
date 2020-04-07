import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsDialogDeleteComponent } from './permissions-dialog-delete.component';

describe('PermissionsDialogDeleteComponent', () => {
  let component: PermissionsDialogDeleteComponent;
  let fixture: ComponentFixture<PermissionsDialogDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsDialogDeleteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
