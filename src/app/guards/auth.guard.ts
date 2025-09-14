import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map, take, filter, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    filter(user => user !== undefined),
    take(1),
    timeout(5000),
    map(user => {
      if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        return true;
      } else {
        console.log('❌ Usuario no autenticado, redirigiendo al login');
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(error => {
      console.error('⚠️ Error en authGuard:', error);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
