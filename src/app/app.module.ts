import { EstablecimientoModule } from './establecimiento/establecimiento.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { AuthGuard } from './core/auth/auth-guard.service';
import { DbConnectService } from './core/db-connect.service';
import { LogoutComponent } from './shared/logout/logout.component';
import { AuthenticationService } from './core/auth/authentication.service';
import { CoreService } from './core/core.service';
import { Routing } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
  NbActionsModule,
  NbUserModule,
  NbMenuModule,
  NbMenuService,
  NbCardModule,
  NbCheckboxModule
} from '@nebular/theme';
import { MainComponent } from './main/main.component';
import { NavComponent } from './shared/nav/nav.component';
import { LoginComponent } from './shared/login/login.component';
import { HttpModule } from '@angular/http';
import { EmptyComponent } from './empty/empty.component';
import {
  NbPasswordAuthStrategy,
  NbAuthModule,
  NbAuthJWTToken
} from '@nebular/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbMenuInternalService } from '@nebular/theme/components/menu/menu.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from 'ng2-completer';
import { TreeModule } from 'angular-tree-component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    LoginComponent,
    LogoutComponent,
    EmptyComponent
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    Routing,
    HttpModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule,
    NbActionsModule,
    NbMenuModule,
    NbUserModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    TreeModule.forRoot(),
    TooltipModule.forRoot(),
    ConfiguracionModule,
    EstablecimientoModule,
    // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: false }),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    NbMenuInternalService,
    CoreService,
    AuthenticationService,
    DbConnectService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
