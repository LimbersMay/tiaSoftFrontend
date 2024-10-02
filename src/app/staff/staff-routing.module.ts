import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SideNavLayoutComponent} from "../shared/layouts/side-nav-layout/side-nav-layout.component";

const routes: Routes = [
  {
    path: '',
    component: SideNavLayoutComponent,
    children: [
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
      },
      {
        path: '**',
        redirectTo: 'menu'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
