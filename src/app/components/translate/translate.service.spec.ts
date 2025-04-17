import { TestBed } from '@angular/core/testing';

import { TranslateServiceLocale } from './translate.service';

describe('TranslateServiceLocale', () => {
  let service: TranslateServiceLocale;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateServiceLocale);
  });

});
