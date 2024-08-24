import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {Router} from "@angular/router";
import {PrimeNGConfig} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'tiaSoftFrontend';

  constructor(
    private authService: AuthService,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {}

  public finishedAuthChecking: boolean = false;

  ngOnInit() {

    this.primengConfig.ripple = true;

    this.primengConfig.setTranslation({
      startsWith: 'Empieza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual',
      notEquals: 'No igual',
      noFilter: 'Sin filtro',
    })

    this.authService.checkAuthStatus()
      .subscribe({
        next: () => {
          this.finishedAuthChecking = true;
          const redirectUrl = localStorage.getItem('redirectUrl');
          this.router.navigate([redirectUrl || '/dashboard']);
        },
        error: () => {
          this.finishedAuthChecking = true;
          this.router.navigate(['/auth/login']);
        },
      });


  }
}
