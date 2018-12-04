import { AmbienteComponent } from './ambiente/ambiente.component';
import { PotreroComponent } from './potrero/potrero.component';
import { PotrerosComponent } from './potreros/potreros.component';
import { PluviometroComponent } from './pluviometro/pluviometro.component';
import { PluviometrosComponent } from './pluviometros/pluviometros.component';
import { EstablecimientosComponent } from './establecimientos/establecimientos.component';
import { AuthGuard } from './../core/auth/auth-guard.service';

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosBasicosComponent } from './datos-basicos/datos-basicos.component';
import { GanadosComponent } from './ganados/ganados.component';
import { GanadoComponent } from './ganado/ganado.component';

const routes: Routes = [
  {
    path: 'establecimiento',
    children: [
      {
        path: 'datos-basicos',
        component: DatosBasicosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'datos-basicos/:id',
        component: DatosBasicosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'establecimientos',
        component: EstablecimientosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pluviometros',
        component: PluviometrosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pluviometro',
        component: PluviometroComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'pluviometro/:id',
        component: PluviometroComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'potreros',
        component: PotrerosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'potrero',
        component: PotreroComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'potrero/:id',
        component: PotreroComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'potrero/:id/ambiente/:ambiente',
        component: AmbienteComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'potrero/:id/ambiente',
        component: AmbienteComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ganados',
        component: GanadosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ganado',
        component: GanadoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ganado/:id',
        component: GanadoComponent,
        canActivate: [AuthGuard]
      },
    ]
  }
];

export const EstablecimientoRouting: ModuleWithProviders = RouterModule.forRoot(
  routes
);
