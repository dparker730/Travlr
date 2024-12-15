import { Injectable, Provider } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let isAuthAPI: boolean;

    // Check if the request is for login or register
    if (request.url.includes('login') || request.url.includes('register')) {
      isAuthAPI = true;
    } else {
      isAuthAPI = false;
    }

    // If user is logged in and the request is not for authentication API,
    // add Authorization header with the JWT token.
    if (this.authenticationService.isLoggedIn() && !isAuthAPI) {
      const token = this.authenticationService.getToken();

      // Clone the request and add the Authorization header with Bearer token.
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // Pass the cloned request to the next handler in the pipeline.
      return next.handle(authReq);
    }

    // If no token or the request is for authentication API, pass the request without modification.
    return next.handle(request);
  }
}

// Exporting the provider to make the interceptor available in the app module.
export const authInterceptProvider: Provider = 
  { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor, multi: true };
