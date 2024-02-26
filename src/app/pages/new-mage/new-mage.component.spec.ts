import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMageComponent } from './new-mage.component';

describe('NewMageComponent', () => {
  let component: NewMageComponent;
  let fixture: ComponentFixture<NewMageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMageComponent]
    });
    fixture = TestBed.createComponent(NewMageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
