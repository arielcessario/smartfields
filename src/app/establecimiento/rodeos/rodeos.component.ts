import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smf-rodeos',
  templateUrl: './rodeos.component.html',
  styleUrls: ['./rodeos.component.scss']
})
export class RodeosComponent implements OnInit {
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
      nroRodeo: {
        title: 'Nro Rodeo',
        type: 'string'
      },
      descripcion: {
        title: 'Descripción',
        type: 'string'
      },
      gananciaDia: {
        title: 'Ganacia/Dia',
        type: 'string'
      },
      gananciaHasta: {
        title: 'Fecha Hasta',
        type: 'string'
      },
      pesoPromedio: {
        title: 'Peso Prom.',
        type: 'string'
      },
    }
  };

  allRows: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  data = [];

  constructor(private router: Router, private localStorage: LocalStorage) { }

  ngOnInit() {
    this.localStorage.getItem<any>('rodeos').subscribe(d => {
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
        this.localStorage.setItem('rodeos', this.data).subscribe(
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
    this.router.navigate(['establecimiento', 'rodeo', event.data.id]);
  }

  create() {
    this.router.navigate(['establecimiento', 'rodeo']);
  }

}
