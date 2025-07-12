import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { Auth } from "../services/auth/auth";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export const handleErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
):any => {
  const auth = inject(Auth);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const excludedUrls = [
  "/Users/login",
  "/Users/register",
  "/Users/forget-password",
  "/Users/submit-new-password",
  "/Users/confirm-password-change",
  ];

  if (excludedUrls.some((url) => req.url.toLowerCase().includes(url))) {
    return next(req);
  }
  const myToken = auth.getaccessToken();
  if (myToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${myToken}`,
      },

    });
  }
  return next(req).pipe(
    catchError((err: any) => {
      if (
             (err.status === 401 || err.status === 403)
         && !excludedUrls.some((url) => req.url.toLowerCase().includes(url))
         &&  auth.getrefreshToken()
      ) {
        return auth.RefreshToken(auth.getrefreshToken()).pipe(
          switchMap((data: any) => {
            auth.saveNewTokens(data);
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${data.accessToken}`,
              },
            });
            return next(clonedReq);
          }),
          catchError((err: any) => {
            toastr.warning(err.message);
            router.navigate(["/login"]);
            auth.removeaccessToken();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  )
};
