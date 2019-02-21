import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InfoComponent} from './info/info.component';
import {CodesListComponent} from './codes-list/codes-list.component';
import {PreFetchGuard} from './codes-list/pre-fetch-guard.service';
import {CodeMapComponent} from './code-map/code-map.component';
import {MenuComponent} from './menu/menu.component';
import {AddAchiComponent} from './menu/add-achi/add-achi.component';

const routes: Routes = [{path: '', component: CodesListComponent, resolve: {result: PreFetchGuard}},
  {path: 'menu', component: MenuComponent,
    children: [
      {path: 'add-achi', component: AddAchiComponent}
    ]}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
