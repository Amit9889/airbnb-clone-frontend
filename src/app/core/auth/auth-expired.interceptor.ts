import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {catchError, throwError} from "rxjs";

export const authExpired: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === HttpStatusCode.Unauthorized &&
        !isAuthRequest(req) &&
        authService.isAuthenticated()
      ) {
        authService.login();
      }

      return throwError(() => err);
    })
  );
};

function isAuthRequest(req: HttpRequest<unknown>): boolean {
  return req.url.includes("api/auth") || req.url.includes("/auth/");
}
