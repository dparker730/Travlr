import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { Observable } from 'rxjs';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtInterceptor],
    });

    interceptor = TestBed.inject(JwtInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept HTTP requests', () => {
    const req = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jasmine.createSpy('handle').and.returnValue(new Observable<HttpEvent<any>>()),
    };

    interceptor.intercept(req, next);

    expect(next.handle).toHaveBeenCalled();
  });
});
