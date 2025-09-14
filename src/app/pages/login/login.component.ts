// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NgClass, NgOptimizedImage, CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import {Divider} from 'primeng/divider';

enum tabOptionstype {
  signIn = 'signIn',
  signUp = 'signUp'
}

@Component({
  selector: 'app-login',
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    NgOptimizedImage,
    NgClass,
    Button,
    PasswordModule,
    MessageModule,
    CommonModule,
    Divider
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  activeTab: tabOptionstype = tabOptionstype.signIn;
  protected readonly tabOptionstype = tabOptionstype;

  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {  }

  switchTab(tab: tabOptionstype) {
    this.activeTab = tab;
    this.clearForm();
  }

  clearForm() {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  validateForm(): boolean {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor ingresa un email válido';
      return false;
    }

    if (this.activeTab === tabOptionstype.signUp) {
      if (this.password.length < 6) {
        this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        return false;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return false;
      }
    }

    return true;
  }

  async loginWithEmail() {
    if (!this.validateForm()) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.loginWithEmail(this.email, this.password);
      this.successMessage = 'Inicio de sesión exitoso';
      // 🚀 El router navegará automáticamente después del login exitoso
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  async registerWithEmail() {
    if (!this.validateForm()) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.registerWithEmail(this.email, this.password);
      this.successMessage = 'Registro exitoso';
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  // Login con Google
  async loginWithGoogle() {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.loginWithGoogle();
      this.successMessage = 'Inicio de sesión con Google exitoso';
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión con Google';
    } finally {
      this.loading = false;
    }
  }

  // Manejar submit del formulario
  onSubmit() {
    if (this.activeTab === tabOptionstype.signIn) {
      this.loginWithEmail();
    } else {
      this.registerWithEmail();
    }
  }

  // Obtener mensaje de error amigable
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo más tarde';
      default:
        return 'Error de autenticación. Inténtalo de nuevo';
    }
  }
}
