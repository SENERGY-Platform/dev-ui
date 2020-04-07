
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClientComponent } from './view-client.component';

describe('ViewClientComponent', () => {
  let component: AddEditClientComponent;
  let fixture: ComponentFixture<AddEditClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditClientComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
