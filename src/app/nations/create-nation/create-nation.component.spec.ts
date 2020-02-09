import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNationComponent } from './create-nation.component';

describe('CreateCustomerComponent', () => {
  let component: CreateNationComponent;
  let fixture: ComponentFixture<CreateNationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
