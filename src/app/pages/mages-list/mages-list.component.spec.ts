import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagesListComponent } from './mages-list.component';

describe('MagesListComponent', () => {
  let component: MagesListComponent;
  let fixture: ComponentFixture<MagesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MagesListComponent]
    });
    fixture = TestBed.createComponent(MagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
