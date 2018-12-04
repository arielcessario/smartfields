import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Establecimiento, Permiso } from './../../model/types';
import { CoreService } from './../../core/core.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ITreeOptions, TREE_ACTIONS, KEYS } from 'angular-tree-component';

@Component({
  selector: 'smf-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  @ViewChild('tree')
  tree;

  form: FormGroup;
  private fb: FormBuilder;
  id = -1;
  usuario: any;
  cargaInicial = false;

  public documentType = 0;
  public documentNumber = '';
  public name = '';
  public lastName = '';
  public phonePrefix = '';
  public phoneNumber = '';
  public mobile = false;
  public mail = '';
  public password = '';
  public establecimientos: Establecimiento[] = [];
  public permisos: Permiso[] = [];
  public permisosSelected = [];

  establecimientosList: Establecimiento[] = [
    { establecimientoId: 0, descripcion: 'Vaquita Feliz' },
    { establecimientoId: 1, descripcion: 'Vaquita Triste' },
    { establecimientoId: 2, descripcion: 'Vauquita' },
    { establecimientoId: 3, descripcion: 'El Toro' }
  ];

  formErrors = {
    documentNumber: '',
    name: '',
    lastName: '',
    phonePrefix: '',
    phoneNumber: '',
    mail: '',
    password: '',
    establecimientos: ''
  };

  validationMessages = {
    documentNumber: {
      required: 'Requerido',
      minlength: 'El DNI debe tener 7 caracteres',
      maxlength: 'El DNI debe tener 15 caracteres'
    },
    name: {
      required: 'Requerido',
      maxlength: 'Maximo 50 caracteres'
    },
    lastName: {
      required: 'Requerido',
      maxlength: 'Maximo 50 caracteres'
    },
    phonePrefix: {
      required: 'Requerido',
      max: 'El password debe tener al menos seis (6) letras y/o números'
    },
    phoneNumber: {
      required: 'Requerido',
      max: 'El password debe tener al menos seis (6) letras y/o números'
    },
    mail: {
      required: 'Requerido',
      email: 'Formato de mail incorrecto'
    },
    password: {
      required: 'Requerido',
      minlength: 'El password debe tener al menos seis (6) letras y/o números',
      pattern:
        'El password debe tener al menos una letra en mayúscula y un número'
    },
    establecimientos: {
      required: 'Requerido',
      minlength: 'El password debe tener al menos seis (6) letras y/o números'
    }
  };

  // PERMISOS
  nodes = [
    {
      name: 'Configuración',
      children: [{ id: 4, name: 'Es Administrador' }]
    },
    {
      name: 'Establecimientos',
      children: [
        { id: 5, name: 'Puede crear Establecimientos' },
        { id: 6, name: 'Puede modificar Establecimientos' }
      ]
    },
    {
      name: 'Planificación',
      children: [
        { id: 7, name: 'Puede crear Planificaciones' },
        { id: 8, name: 'Puede modificar Planificaciones' },
        { id: 9, name: 'Es Supervisor' }
      ]
    }
  ];

  options: ITreeOptions = {
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        },
        click: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          } else {
            TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event);
          }
          // console.log(node);
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    }
  };

  constructor(
    private coreService: CoreService,
    private localStorage: LocalStorage,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.id = p.id;
        this.localStorage.getItem<any>('usuarios').subscribe(usuarios => {
          for (let i = 0; i < usuarios.length; i++) {
            if ('' + usuarios[i].id === '' + this.id) {
              this.usuario = usuarios[i];
            }
          }
          this.buildForm();
        });
      } else {
        this.buildForm();
      }
    });
  }
  ngAfterViewInit() {
    this.cargaInicial = true;
    setTimeout(() => {
      this.tree.treeModel.expandAll();

      for (const node of this.tree.treeModel.nodes) {
        for (const child of node.children) {
          for (const perm in this.usuario.permisos) {
            if (this.usuario.permisos[perm] === child.id) {
              this.tree.treeModel.getNodeById(child.id).setIsActive(true, true);
            }
          }
        }
      }

      this.cargaInicial = false;
    }, 1000);
  }

  submit() {
    const establecimientosIds = this.form.value.establecimientos
      .map(
        (v, i) => (v ? this.establecimientosList[i].establecimientoId : null)
      )
      .filter(v => v !== null);

    const plu = {
      id: this.id,
      documentType: this.form.get('documentType').value,
      documentNumber: this.form.get('documentNumber').value,
      name: this.form.get('name').value,
      lastName: this.form.get('lastName').value,
      phonePrefix: this.form.get('phonePrefix').value,
      phoneNumber: this.form.get('phoneNumber').value,
      mobile: this.form.get('mobile').value,
      mail: this.form.get('mail').value,
      password: this.form.get('password').value,
      permisos: this.permisosSelected,
      establecimientos: establecimientosIds
    };
    this.localStorage.getItem<any>('usuarios').subscribe(
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

        this.localStorage.setItem('usuarios', p).subscribe(
          arg => {
            this.location.go('/configuracion/usuario/' + this.id);
            this.coreService.showSuccess({
              title: 'Exito',
              body: 'Los datos han sido guardados'
            });
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
    // Checkbox de establecimientos

    const controls = this.establecimientosList.map(c => {
      let selected = false;
      if (this.usuario) {
        for (let i = 0; i < this.usuario.establecimientos.length; i++) {
          if (c.establecimientoId === this.usuario.establecimientos[i]) {
            selected = true;
          }
        }
      }

      return new FormControl(selected);
    });
    // controls[0].setValue(true);

    const group: any = {
      documentType: [this.documentType],
      documentNumber: [
        this.documentNumber,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15)
        ]
      ],
      name: [this.name, [Validators.required, Validators.maxLength(50)]],
      lastName: [
        this.lastName,
        [Validators.required, Validators.maxLength(50)]
      ],
      phonePrefix: [
        this.phonePrefix,
        [Validators.required, Validators.max(9999)]
      ],
      phoneNumber: [
        this.phoneNumber,
        [Validators.required, Validators.max(9999999)]
      ],
      mobile: [this.mobile],
      mail: [this.mail, [Validators.required, Validators.email]],
      password: [this.password, [Validators.required, Validators.minLength(8)]],
      establecimientos: new FormArray(controls, this.minSelectedCheckboxes(2)),
      permisos: [this.permisos]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['documentType'].setValue(0);
    form.controls['documentNumber'].setValue('');
    form.controls['name'].setValue('');
    form.controls['lastName'].setValue('');
    form.controls['phonePrefix'].setValue('');
    form.controls['phoneNumber'].setValue('');
    form.controls['mobile'].setValue(true);
    form.controls['mail'].setValue('');
    form.controls['password'].setValue('');
    form.controls['permisos'].setValue([]);
    if (this.id !== -1) {
      form.controls['documentType'].setValue(this.usuario['documentType']);
      form.controls['documentNumber'].setValue(this.usuario['documentNumber']);
      form.controls['name'].setValue(this.usuario['name']);
      form.controls['lastName'].setValue(this.usuario['lastName']);
      form.controls['phonePrefix'].setValue(this.usuario['phonePrefix']);
      form.controls['phoneNumber'].setValue(this.usuario['phoneNumber']);
      form.controls['mobile'].setValue(this.usuario['mobile']);
      form.controls['mail'].setValue(this.usuario['mail']);
      form.controls['password'].setValue(this.usuario['password']);
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
    // e.toggleActivated();
    this.permisosSelected.push(e.node.data.id);
  }

  onDeactivate(e) {
    // if (this.cargaInicial) {
    //   return;
    // }

    let encontrado = -1;
    for (let i = 0; i < this.permisosSelected.length; i++) {
      if (this.permisosSelected[i] === e.node.data.id) {
        encontrado = i;
      }
    }
    if (encontrado > -1) {
      this.permisosSelected.splice(encontrado, 1);
    }
  }

  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => (next ? prev + next : prev), 0);

      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }
}
