import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'tiaSoftFrontend';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public finishedAuthChecking: boolean = false;

  ngOnInit() {
    this.authService.checkAuthStatus()
      .subscribe({
        next: () => {
          this.finishedAuthChecking = true;
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.finishedAuthChecking = true;
          this.router.navigate(['/auth/login']);
        },
      })
  }
}
