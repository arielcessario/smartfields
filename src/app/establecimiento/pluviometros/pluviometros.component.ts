import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'smf-pluviometros',
  templateUrl: './pluviometros.component.html',
  styleUrls: ['./pluviometros.component.scss']
})
export class PluviometrosComponent implements OnInit {
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
      description: {
        title: 'Descripción',
        type: 'string'
      },
      fechaInstalacion: {
        title: 'Fecha de Instalación',
        type: 'date'
      },
      cantidadPotreros: {
        title: 'Cantidad de Potreros',
        type: 'string'
      },
      mmAcumulados: {
        title: 'mm Acumulados',
        type: 'string'
      }
    }
  };

  allRows: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  data = [];

  constructor(private router: Router, private localStorage: LocalStorage) {}

  ngOnInit() {
    this.localStorage.getItem<any>('pluviometros').subscribe(d => {
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
        this.localStorage.setItem('pluviometros', this.data).subscribe(
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
    this.router.navigate(['establecimiento', 'pluviometro', event.data.id]);
  }

  create() {
    this.router.navigate(['establecimiento', 'pluviometro']);
  }
}
