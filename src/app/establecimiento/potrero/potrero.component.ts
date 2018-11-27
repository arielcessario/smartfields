import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CoreService } from './../../core/core.service';
import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormArray,
  ValidatorFn
} from '@angular/forms';

@Component({
  selector: 'smf-potrero',
  templateUrl: './potrero.component.html',
  styleUrls: ['./potrero.component.scss']
})
export class PotreroComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  datoBasico: any;
  id = -1;

  public nroPotrero = '';
  public ambientes = '';
  public hectareas = '';

  formErrors = {
    nroPotrero: '',
    ambientes: '',
    hectareas: ''
  };

  validationMessages = {
    nroPotrero: {
      required: 'Requerido',
      minlength: 'Mínimo 15 caracteres',
      maxlength: 'Máximo 15 caracteres'
    },
    ambientes: {
      required: 'Requerido',
      maxlength: 'El ambientes debe tener 15 caracteres',
      minlength: 'El ambientes debe tener 15 caracteres'
    },
    hectareas: {
      required: 'Requerido',
      minlength: 'El hectareas debe tener al menos seis (6) letras y/o números',
      pattern:
        'El hectareas debe tener al menos una letra en mayúscula y un número'
    }
  };

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
      tipo: {
        title: 'Tipo',
        type: 'string'
      },
      hectareas: {
        title: 'Hectáreas',
        type: 'string'
      },
      coeficiente: {
        title: 'Coeficiente',
        type: 'string'
      },
      disponibilidad: {
        title: 'Disponibilidad KgMS',
        type: 'string'
      },
      molinos: {
        title: 'Molinos',
        type: 'string'
      }
    }
  };

  allRows: Array<any> = [];
  source: LocalDataSource = new LocalDataSource();
  data = [];

  constructor(
    private coreService: CoreService,
    private localStorage: LocalStorage,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.id = p.id;
        this.localStorage
          .getItem<any>('datosBasicos')
          .subscribe(datosBasicos => {
            for (let i = 0; i < datosBasicos.length; i++) {
              if ('' + datosBasicos[i].id === '' + this.id) {
                this.datoBasico = datosBasicos[i];

                this.localStorage.getItem<any>('datosBasicos').subscribe(d => {
                  if (d) {
                    this.data = d;
                    this.source.load(this.data);
                  }
                });
              }
            }
            this.buildForm();
          });
      } else {
        this.buildForm();
      }
    });
  }

  submit() {
    const plu = {
      id: this.id,
      nroPotrero: this.form.get('nroPotrero').value,
      ambientes: this.form.get('ambientes').value,
      hectareas: this.form.get('hectareas').value
    };
    this.localStorage.getItem<any>('datosBasicos').subscribe(
      p => {
        console.log(p);

        if (!p) {
          p = [];
        }
        if (this.id !== -1) {
          for (let i = 0; i < p.length; i++) {
            if ('' + p[i].id === '' + this.id) {
              p[i] = plu;
            }
          }
        } else {
          p.push(plu);
          plu.id = p.length + 1;
          this.id = plu.id;
        }

        this.localStorage.setItem('potreros', p).subscribe(
          arg => {
            this.location.go('/establecimiento/potreros/' + this.id);
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  buildForm() {
    // Checkbox de cantidadPotreros

    const group: any = {
      nroPotrero: [this.nroPotrero, [Validators.required]],
      ambientes: [
        this.ambientes,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ]
      ],
      hectareas: [this.hectareas, [Validators.required]]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['nroPotrero'].setValue('');
    form.controls['ambientes'].setValue('');
    form.controls['hectareas'].setValue('');

    if (this.id !== -1) {
      form.controls['nroPotrero'].setValue(this.datoBasico['nroPotrero']);
      form.controls['ambientes'].setValue(this.datoBasico['ambientes']);
      form.controls['hectareas'].setValue(this.datoBasico['hectareas']);
    }

    this.form = form;
    this.form.valueChanges.subscribe(data => {
      this.formErrors = this.coreService.onValueChanged(
        data,
        form,
        this.formErrors,
        this.validationMessages
      );
    });

    this.coreService.onValueChanged();
  }

  onActivate(e) {
    console.log(e);
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
        this.localStorage.setItem('potreros', this.data).subscribe(
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
    this.router.navigate(['establecimiento', 'potrero', this.id, 'ambiente', event.data.id]);
  }

  create() {
    this.router.navigate(['establecimiento', 'potrero', this.id, 'ambiente']);
  }
}
