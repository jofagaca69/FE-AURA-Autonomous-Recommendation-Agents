import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Button, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userEmail: string = '';
  userName: string = '';
  sidebarVisible = true;
  sidebarCollapsed = false;
  isMobile = false;

  constructor(private authService: AuthService) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userEmail = currentUser.email || '';
      this.userName = currentUser.displayName || 'Usuario';
    }
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarVisible = false;
    } else {
      this.sidebarVisible = true;
    }
  }

  toggleMobileSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleDesktopSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
