import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMageComponent } from './modify-mage.component';

describe('ModifyMageComponent', () => {
  let component: ModifyMageComponent;
  let fixture: ComponentFixture<ModifyMageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyMageComponent]
    });
    fixture = TestBed.createComponent(ModifyMageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
