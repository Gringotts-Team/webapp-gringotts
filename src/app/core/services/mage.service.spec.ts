import { TestBed } from '@angular/core/testing';

import { MageService } from './mage.service';

describe('MageService', () => {
  let service: MageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
