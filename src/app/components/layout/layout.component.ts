import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield'; // opcional si usas icons de PrimeNG

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, DrawerModule, ButtonModule, IconFieldModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isMobileOpen = signal(false);   // Para móviles (Drawer)
  isCollapsed = signal(false);    // Para desktop (sidebar expandido/colapsado)

  toggleMobile() {
    this.isMobileOpen.set(!this.isMobileOpen());
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }
}
