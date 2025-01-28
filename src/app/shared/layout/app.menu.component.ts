import {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {LayoutService} from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService) {
  }

  ngOnInit() {
    const adminPrefix = '';
    const staffPrefix = 'staff';

    const adminNavItems = [
      {
        label: 'Home',
        items: [
          { label: 'Resumen', icon: 'pi pi-fw pi-chart-pie', routerLink: [`${adminPrefix}/dashboard`] },
          { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: [`${adminPrefix}/users/list`] },
          { label: 'Roles', icon: 'pi pi-fw pi-key', routerLink: [`${adminPrefix}/roles/list`] },
          { label: 'Categorías', icon: 'pi pi-fw pi-tags', routerLink: [`${adminPrefix}/categories/list`] },
          { label: 'Menú', icon: 'pi pi-fw pi-book', routerLink: [`${adminPrefix}/products/list`] },
          { label: 'Áreas', icon: 'pi pi-fw pi-sitemap', routerLink: [`${adminPrefix}/areas/list`] },
          { label: 'Mesas', icon: 'pi pi-fw pi-th-large', routerLink: [`${adminPrefix}/tables/list`] },
          { label: 'Cuentas', icon: 'pi pi-fw pi-money-bill', routerLink: [`${adminPrefix}/accounts/list`] }
        ]
      }
    ];

    const staffNavItems = [
      {
        label: 'Home',
        items: [
          { label: 'Mesas', icon: 'pi pi-fw pi-th-large', routerLink: [`/${staffPrefix}/tables/list`] },
          { label: 'Menú', icon: 'pi pi-fw pi-book', routerLink: [`${staffPrefix}/menu/list`] },
        ]
      }
    ];

    this.model = adminNavItems;
  }
}
