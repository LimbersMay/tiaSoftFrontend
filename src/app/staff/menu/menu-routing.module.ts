import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";

const routes: Routes = [
  {
    path: 'list',
    component: MainPageComponent,
    data: {
      routeIdx: 0
    }
  },
  {
    path: '**',
    redirectTo: 'list'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
