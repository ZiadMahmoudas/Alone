import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

export const notReturnLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  if(auth.getaccessToken()){
    router.navigate(['/Home']);
    return false;
  }
  return true;
};
