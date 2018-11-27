import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRoute,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CoreService } from '../core.service';

@Injectable()
export class AuthGuard implements CanActivate {
  static to = '';

  constructor(private router: Router, private coreService: CoreService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.router.events.subscribe((d)=>{
    //     console.log(d);
    // })
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      // Decoding JWT public part
      // const base64Url = currentUser.token.split('.')[1];
      // const base64 = base64Url.replace('-', '+').replace('_', '/');
      // const decoded = JSON.parse(window.atob(base64));
      // const rol = decoded.data.rol_id;
      // const permisos = decoded.data.permisos;
      // let encontrado = -1;
      // // Get current url
      // // console.log(route);
      // // console.log(state.url);
      // for (let i = 0; i < permisos.length; i++) {
      //   if (permisos[i].obj === state.url) {
      //     encontrado = i;
      //   }
      // }

      // if (encontrado === -1) {
      //   this.coreService.setToast({
      //     type: 'error',
      //     title: 'Navegación',
      //     body: 'No tiene permisos para navegar a esta sección'
      //   });
      //   this.router.navigate(['/login']);
      //   return false;
      // }

      // if (rol >= permisos[encontrado].navegar) {
      //   return true;
      // } else {
      //   this.coreService.setToast({
      //     type: 'error',
      //     title: 'Navegación',
      //     body: 'No tiene permisos para navegar a esta sección'
      //   });
      //   this.router.navigate(['/login']);
      //   return false;
      // }

      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);

    this.coreService.setLoginStatus({ isLogged: false });
    return false;
  }
}
