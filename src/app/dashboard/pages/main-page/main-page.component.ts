import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styles: ``
})
export class MainPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public onLogout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login'])
    })
  }
}
