import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbCheckboxModule } from '@nebular/theme';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DatosBasicosComponent } from './datos-basicos/datos-basicos.component';
import { EstablecimientoRouting } from './establecimiento.routes';
import { EstablecimientosComponent } from './establecimientos/establecimientos.component';
import { PluviometrosComponent } from './pluviometros/pluviometros.component';
import { PluviometroComponent } from './pluviometro/pluviometro.component';
import { AgmCoreModule } from '@agm/core';
import { PotrerosComponent } from './potreros/potreros.component';
import { PotreroComponent } from './potrero/potrero.component';
import { AmbienteComponent } from './ambiente/ambiente.component';

@NgModule({
  declarations: [
    DatosBasicosComponent,
    EstablecimientosComponent,
    PluviometrosComponent,
    PluviometroComponent,
    PotrerosComponent,
    PotreroComponent,
    AmbienteComponent
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    EstablecimientoRouting,
    NbCardModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    TooltipModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAokk29N-qA9rUHrnhWrWxLLYhEn8LMtLI'
    })
  ],
  providers: [],
  bootstrap: []
})
export class EstablecimientoModule {}
