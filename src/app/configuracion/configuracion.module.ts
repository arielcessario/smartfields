import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TreeModule } from 'angular-tree-component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ConfiguracionRouting } from './configuracion.routes';
import { NbCardModule, NbCheckboxModule } from '@nebular/theme';

@NgModule({
  declarations: [UsuarioComponent, UsuariosComponent],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    ConfiguracionRouting,
    NbCardModule,
    NbCheckboxModule,
    TreeModule.forRoot(),
    TooltipModule.forRoot(),
    Ng2SmartTableModule
  ],
  providers: [],
  bootstrap: []
})
export class ConfiguracionModule {}
