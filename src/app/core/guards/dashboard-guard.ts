import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { jwtDecode } from 'jwt-decode';

export const dashboardGuard: CanMatchFn = (route, segments) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const accessToken: any = auth.getaccessToken();
  const decoded = jwtDecode<{ [key: string]: any }>(accessToken);
  const role = decoded['role'];
  const isAdmin = true;
    if (!accessToken) {
    router.navigate(['/login']);
    return false;
  }
  if (role === 'admin') {
    return isAdmin;
  }
return !isAdmin;
};
