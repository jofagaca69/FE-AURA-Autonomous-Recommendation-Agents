// src/app/services/auth/auth.service.ts
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  User,
  authState,
  user
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private router = inject(Router);
  private googleProvider = new GoogleAuthProvider();

  // Observable del usuario actual
  user$: Observable<User | null> = user(this.auth);
  authState$ = authState(this.auth);

  constructor() {
    // Configurar el proveedor de Google
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');
  }

  // Registro con email y contraseña
  async registerWithEmail(email: string, password: string): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registro exitoso:', result.user?.email);
      return result;
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Login con email y contraseña
  async loginWithEmail(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login exitoso:', result.user?.email);
      return result;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Login con Google
  async loginWithGoogle(): Promise<any> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      console.log('Google login exitoso:', {
        uid: result.user?.uid,
        email: result.user?.email,
        displayName: result.user?.displayName,
        photoURL: result.user?.photoURL
      });
      return result;
    } catch (error: any) {
      console.error('Error en Google login:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Inicio de sesión cancelado');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqueado por el navegador');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Solicitud cancelada');
      }

      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
