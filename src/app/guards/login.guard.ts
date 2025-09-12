import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(user => {
      if (user) {
        console.log('Usuario ya autenticado, redirigiendo al dashboard');
        router.navigate(['/dashboard']);
        return false;
      } else {
        console.log('Usuario no autenticado, puede acceder al login');
        return true;
      }
    })
  );
};
