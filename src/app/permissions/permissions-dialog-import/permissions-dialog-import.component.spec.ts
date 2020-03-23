import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsDialogImportComponent } from './permissions-dialog-import.component';

describe('PermissionsDialogImportComponent', () => {
  let component: PermissionsDialogImportComponent;
  let fixture: ComponentFixture<PermissionsDialogImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionsDialogImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsDialogImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
