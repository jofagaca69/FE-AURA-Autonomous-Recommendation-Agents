import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(user => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
        return true;
      } else {
        console.log('Usuario no autenticado, redirigiendo al login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
