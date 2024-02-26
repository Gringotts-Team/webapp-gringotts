import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMageComponent } from './update-mage.component';

describe('UpdateMageComponent', () => {
  let component: UpdateMageComponent;
  let fixture: ComponentFixture<UpdateMageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMageComponent]
    });
    fixture = TestBed.createComponent(UpdateMageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
