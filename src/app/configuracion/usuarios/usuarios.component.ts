import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'smf-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
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
      mail: {
        title: 'Mail',
        type: 'string'
      },
      type: {
        title: 'Tipo',
        type: 'string'
      },
      id_number: {
        title: 'Número de Documento',
        type: 'string'
      },
      name: {
        title: 'Nombre',
        type: 'string'
      },
      last_name: {
        title: 'Apellido',
        type: 'string'
      },
      facility: {
        title: 'Establecimiento',
        type: 'string'
      },
      phone: {
        title: 'Teléfono',
        type: 'string'
      }
    }
  };

  allRows: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  data = [];

  constructor(private router: Router, private localStorage: LocalStorage) {}

  ngOnInit() {
    this.localStorage.getItem<any>('usuarios').subscribe(d => {
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
        this.localStorage.setItem('usuarios', this.data).subscribe(
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
    this.router.navigate(['configuracion', 'usuario', event.data.id]);
  }

  create() {
    this.router.navigate(['configuracion', 'usuario']);
  }
}
