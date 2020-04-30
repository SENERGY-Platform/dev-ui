
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleServiceDocComponent } from './single-service-doc.component';

describe('SingleServiceDocComponent', () => {
  let component: SingleServiceDocComponent;
  let fixture: ComponentFixture<SingleServiceDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleServiceDocComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleServiceDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
