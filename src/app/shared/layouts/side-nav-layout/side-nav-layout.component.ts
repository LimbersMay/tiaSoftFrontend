import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Params, Router} from "@angular/router";

export interface NavItem {
  title: string;
  icon: string;
  link: string;
  queryParams?: Params;
}

@Component({
  selector: 'shared-side-nav-layout',
  templateUrl: './side-nav-layout.component.html',
  styles: ``
})
export class SideNavLayoutComponent implements OnInit {

  public showNavBar = false;

  public navItems: NavItem[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  public get currentUser() {
    return this.authService.currentUser;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login'])
    });
  }

  toggleNavBar() {
    this.showNavBar = !this.showNavBar;
  }

  public ngOnInit() {
    const adminPrefix = '';
    const staffPrefix = 'staff';

    const adminNavItems = [
      {
        title: 'Resumen',
        icon: 'pi-chart-pie',
        link: `${adminPrefix}/dashboard`
      },
      {
        title: 'Usuarios',
        icon: 'pi-users',
        link: `${adminPrefix}/users/list`
      },
      {
        title: 'Roles',
        icon: 'pi-key',
        link: `${adminPrefix}/roles/list`
      },
      {
        title: 'Categorias',
        icon: 'pi-tags',
        link: `${adminPrefix}/categories/list`
      },
      {
        title: 'Menu',
        icon: 'pi-book',
        link: `${adminPrefix}/products/list`
      },
      {
        title: 'Areas',
        icon: 'pi-sitemap',
        link: `${adminPrefix}/areas/list`
      },
      {
        title: 'Mesas',
        icon: 'pi-th-large',
        link: `${adminPrefix}/tables/list`
      },
      {
        title: 'Cuentas',
        icon: 'pi-money-bill',
        link: `${adminPrefix}/accounts/list`
      }
    ];

    const staffNavItems: NavItem[] = [
      {
        title: 'Mesas',
        icon: 'pi-th-large',
        link: `/${staffPrefix}/tables/list`
      },
      {
        title: 'Ordenes',
        icon: 'pi-shopping-cart',
        link: `/${staffPrefix}/orders/list`
      }
    ]

    this.navItems = adminNavItems;
  }
}
