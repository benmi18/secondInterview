import { TestBed } from '@angular/core/testing';

import { JsonplaceholderService } from './jsonplaceholder.service';

describe('JsonplaceholderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JsonplaceholderService = TestBed.get(JsonplaceholderService);
    expect(service).toBeTruthy();
  });
});
