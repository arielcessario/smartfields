import { AuthGuard } from './../core/auth/auth-guard.service';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'configuracion',
    children: [
      {
        path: 'usuario/:id',
        component: UsuarioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

export const ConfiguracionRouting: ModuleWithProviders = RouterModule.forRoot(
  routes
);
