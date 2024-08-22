import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'shared-side-nav-layout',
  templateUrl: './side-nav-layout.component.html',
  styles: ``
})
export class SideNavLayoutComponent {

  public showNavBar = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login'])
    });
  }

  toggleNavBar() {
    this.showNavBar = !this.showNavBar;
  }
}
