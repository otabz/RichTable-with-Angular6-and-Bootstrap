import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CodesListComponent } from './codes-list/codes-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InfoComponent} from './info/info.component';
import {PreFetchGuard} from './codes-list/pre-fetch-guard.service';
import {CodeMapComponent} from './code-map/code-map.component';
import {SearchService} from './search.service';
import {NodesComponent} from './codes-list/nodes/nodes.component';
import {MenuComponent} from './menu/menu.component';
import {AddAchiComponent} from './menu/add-achi/add-achi.component';
import {GrowlDirective} from './code-map/growl.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CodesListComponent,
    InfoComponent,
    CodeMapComponent,
    NodesComponent,
    MenuComponent,
    AddAchiComponent,
    GrowlDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [SearchService, PreFetchGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
