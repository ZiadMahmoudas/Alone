import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router)
  if(auth.getaccessToken()){
    return true;
  }
  router.navigateByUrl("/login");
  return false;
};
