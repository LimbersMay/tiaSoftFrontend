import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {SideNavLayoutComponent} from "../shared/layouts/side-nav-layout/side-nav-layout.component";

const routes: Routes = [
  {
    path: '',
    component: SideNavLayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      },
      {
        path: "**",
        redirectTo: ''
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
