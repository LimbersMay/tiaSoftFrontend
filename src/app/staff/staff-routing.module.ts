import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {tableIdGuardGuard} from "./tables/Guards/table-id-guard.guard";

const routes: Routes = [
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule),
    title: 'Menu',
    canActivate: [tableIdGuardGuard]
  },
  {
    path: 'tables',
    loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule),
    title: 'Mesas'
  },
  {
    path: '**',
    redirectTo: 'menu'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
