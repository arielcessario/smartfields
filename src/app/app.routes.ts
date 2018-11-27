
import { AuthGuard } from './core/auth/auth-guard.service';
import { MainComponent } from './main/main.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyComponent } from './empty/empty.component';

const routes: Routes = [
  { path: '', redirectTo: 'establecimiento/establecimientos', pathMatch: 'full' },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  // { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'usuario/:id',
  //   component: UsuarioComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'usuario',
  //   component: UsuarioComponent,
  //   canActivate: [AuthGuard]
  // },
  // { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  // { path: 'diagnosticos', component: DiagnosticosComponent, canActivate: [AuthGuard] },
  // { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard] },
  // { path: 'paciente', component: PacienteComponent, canActivate: [AuthGuard] },
  // { path: 'paciente/:id', component: PacienteComponent, canActivate: [AuthGuard] },
  // { path: 'definiciones', component: DefinicionesComponent, canActivate: [AuthGuard] },
  // { path: 'definicion/:id', component: DefinicionComponent, canActivate: [AuthGuard] },
  // { path: 'organos', component: OrganosComponent, canActivate: [AuthGuard] },
  // { path: 'organo', component: OrganoComponent, canActivate: [AuthGuard] },
  // { path: 'organo/:id', component: OrganoComponent, canActivate: [AuthGuard] },
  // { path: 'unidades', component: UnidadesComponent, canActivate: [AuthGuard] },
  // { path: 'endpoints', component: EndpointsComponent, canActivate: [AuthGuard] },
  // { path: 'diagnostico', component: DiagnosticoComponent, canActivate: [AuthGuard] },
  { path: 'login', component: EmptyComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
