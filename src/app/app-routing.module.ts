import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {isAuthenticatedGuard} from "./auth/guards/is-authenticated.guard";
import {isNotAuthenticatedGuard} from "./auth/guards/is-not-authenticated.guard";
import {AppLayoutComponent} from "./shared/layout/app.layout.component";

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./users-management/users-management.module').then(m => m.UsersManagementModule)
      },
      {
        path: 'roles',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./roles-management/roles-management.module').then(m => m.RolesManagementModule)
      },
      {
        path: 'categories',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./categories-management/categories-management.module').then(m => m.CategoriesManagementModule)
      },
      {
        path: 'products',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./products-management/products-management.module').then(m => m.ProductsManagementModule)
      },
      {
        path: 'areas',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./areas-management/areas-management.module').then(m => m.AreasManagementModule)
      },
      {
        path: 'tables',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./tables-management/tables-management.module').then(m => m.TablesManagementModule)
      },
      {
        path: 'orders',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./orders-management/orders-management.module').then(m => m.OrdersManagementModule)
      },
      {
        path: 'staff',
        canActivate: [isAuthenticatedGuard],
        loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableViewTransitions: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
