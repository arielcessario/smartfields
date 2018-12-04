import { CoreService } from './../../core/core.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smf-establecimientos',
  templateUrl: './establecimientos.component.html',
  styleUrls: ['./establecimientos.component.scss']
})
export class EstablecimientosComponent implements OnInit {
  settings = {
    mode: 'external',
    actions: {
      delete: true
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmEdit: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      razonSocial: {
        title: 'Razón Social',
        type: 'string'
      },
      cuit: {
        title: 'CUIT',
        type: 'string'
      },
      fecha: {
        title: 'Fecha',
        type: 'date'
      },
      alias: {
        title: 'Alias',
        type: 'string'
      },
      region: {
        title: 'Región',
        type: 'string'
      },
      zona: {
        title: 'Zona',
        type: 'string'
      },
      direccion: {
        title: 'Dirección',
        type: 'string'
      },
      hectareas: {
        title: 'Hectáreas',
        type: 'number'
      },
      cantidadPotreros: {
        title: 'Cant. Potreros',
        type: 'number'
      },
      telefono: {
        title: 'Teléfono',
        type: 'number'
      },
      celular: {
        title: 'Celular',
        type: 'number'
      },
      mail: {
        title: 'Mail',
        type: 'string'
      }
    }
  };

  allRows: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  data = [];

  constructor(
    private router: Router,
    private localStorage: LocalStorage,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.localStorage.getItem<any>('datosBasicos').subscribe(d => {
      if (d) {
        this.data = d;
        this.source.load(this.data);
      }
    });
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      let encontrado = -1;
      for (let i = 0; i < this.data.length; i++) {
        if ('' + this.data[i].id === '' + event.data.id) {
          encontrado = i;
        }
      }

      if (encontrado > -1) {
        this.data.splice(encontrado, 1);
        this.source.load(this.data);
        this.localStorage.setItem('datosBasicos', this.data).subscribe(
          arg => {
            console.log(arg);
          },
          err => {
            console.log(err);
          }
        );
      }
    } else {
      // event.confirm.reject();
    }
  }

  update(event): void {
    this.coreService.setEstablecimiento(event.data.id);
    this.router.navigate(['establecimiento', 'datos-basicos', event.data.id]);
  }

  create() {
    this.router.navigate(['establecimiento', 'datos-basicos']);
  }
}
