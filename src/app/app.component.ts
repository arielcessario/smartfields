import { Router, NavigationEnd } from '@angular/router';
import { CoreService } from './core/core.service';
import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'smf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  logged = false;
  selectedNavLink = '';
  showNavigation = false;

  items: NbMenuItem[] = [
    {
      title: 'Establecimiento',
      icon: 'nb-home',
      link: '/main',
      children: [
        {
          title: 'Datos Básicos',
          link: '/establecimiento/establecimientos'
        },
        {
          title: 'Pluviometros',
          link: '/establecimiento/pluviometros'
        },
        {
          title: 'Potreros',
          link: '/establecimiento/potreros'
        },
        {
          title: 'Ganados',
          link: '/establecimiento/ganados'
        },
        {
          title: 'Rodeos',
          link: '/establecimiento/rodeos'
        }
      ]
    },
    {
      title: 'Planificación',
      icon: 'nb-compose',
      link: '/main',
      children: [
        {
          title: 'Creación de Planificación',
          link: '/main1'
        },
        {
          title: 'Definición de Escenario',
          link: '/main1'
        },
        {
          title: 'Ecuaciones',
          link: '/main1'
        },
        {
          title: 'Lluvias',
          link: '/main1'
        },
        {
          title: 'Cálculo de Consumo por Rodeo',
          link: '/main1'
        },
        {
          title: 'Cálculo producción y disponibilidad por Potrero',
          link: '/main1'
        },
        {
          title: 'Planificación de Rotación de Ganado',
          link: '/main1'
        },
        {
          title: 'Evaluación de Plan',
          link: '/main1'
        },
        {
          title: 'Planificación de Actividades',
          link: '/main1'
        }
      ]
    },
    {
      title: 'Ejecución',
      icon: 'nb-star',
      link: '/main',
      children: [
        {
          title: 'Plan vs Actual',
          link: '/main1'
        },
        {
          title: 'Lluvias',
          link: '/main1'
        },
        {
          title: 'Tacto',
          link: '/main1'
        },
        {
          title: 'Requerimientos',
          link: '/main1'
        },
        {
          title: 'Disponibilidad',
          link: '/main1'
        },
        {
          title: 'Rotación',
          link: '/main1'
        },
        {
          title: 'Actividades',
          link: '/main1'
        },
        {
          title: 'Alertas',
          link: '/main1'
        }
      ]
    },
    {
      title: 'Reportes',
      icon: 'nb-list',
      link: '/main',
      children: []
    },
    {
      title: 'Configuración',
      icon: 'nb-gear',
      link: '/main',
      children: [
        {
          title: 'Usuarios',
          link: '/configuracion/usuarios'
        },
        {
          title: 'Parámetros del Sistema',
          link: '/main1'
        },
        {
          title: 'Contraseña',
          link: '/main1'
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private coreService: CoreService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        this.selectedNavLink = '' + event.url;
      }

      if (this.coreService.getEstablecimientoSelected() !== -1) {
        this.showNavigation = true;
      } else {
        this.showNavigation = false;
      }
    });

    this.coreService.onSetEstablecimientoId.subscribe(
      (establecimientoId: number) => {
        if (establecimientoId === -1) {
          this.showNavigation = false;
        } else {
          this.showNavigation = true;
        }
      }
    );

    this.coreService.getLoginStatus.subscribe(arg => (this.logged = arg));
    this.coreService.onShowSuccess.subscribe(value => {
      this.showSuccess(value);
    });
    this.coreService.onShowError.subscribe(value => {
      this.showError(value);
    });
  }
  showSuccess(value) {
    // {
    //     type: 'error',
    //     title: 'Navegación',
    //     body: 'No tiene permisos para navegar a esta sección'
    //   }
    this.toastr.success(value.title, value.body);
  }

  showError(value) {
    this.toastr.error(value.title, value.body);
  }
}
