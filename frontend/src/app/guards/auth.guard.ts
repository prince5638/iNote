import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // inject the AuthService
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated())
  {
    return true;
  }
  else{
    // Redirect to the login page if not authenticated
    router.navigate(['/login']);
    return false;
  }
};
