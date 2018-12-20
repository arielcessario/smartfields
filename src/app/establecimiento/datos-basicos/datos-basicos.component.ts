import { LocalStorage } from '@ngx-pwa/local-storage';
import { ActivatedRoute } from '@angular/router';
import { Establecimiento, Permiso } from './../../model/types';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import { CoreService } from '../../core/core.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'smf-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss']
})
export class DatosBasicosComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  datoBasico: any;
  id = -1;

  public razonSocial = '';
  public cuit = '';
  public fecha = '';
  public alias = '';
  public region = [];
  public zona = [];
  public direccion = '';
  public hectareas = 0;
  public cantidadPotreros = 0;
  public phonePrefix = '';
  public phoneNumber = '';
  public mobile = '';
  public mail = '';

  formErrors = {
    razonSocial: '',
    cuit: '',
    fecha: '',
    alias: '',
    region: '',
    zona: '',
    direccion: '',
    hectareas: '',
    cantidadPotreros: '',
    phonePrefix: '',
    phoneNumber: '',
    mobile: '',
    mail: ''
  };

  validationMessages = {
    razonSocial: {
      required: 'Requerido',
      minlength: 'La Razón Social debe tener mas de 1 caracter',
      maxlength: 'La Razón Social debe tener hasta 50 caracteres'
    },
    cuit: {
      required: 'Requerido',
      maxlength: 'El CUIT debe tener 11 caracteres',
      minlength: 'El CUIT debe tener 11 caracteres'
    },
    fecha: {
      required: 'Requerido',
      maxlength: 'Maximo 10 caracteres',
    },
    alias: {
      required: 'Requerido',
      maxlength: 'El Alias debe tener hasta 50 caracteres'
    },
    region: {
      required: 'Requerido',
    },
    zona: {
      required: 'Requerido',
    },
    direccion: {
      required: 'Requerido',
      edireccion: 'Formato de direccion incorrecto'
    },
    hectareas: {
      required: 'Requerido',
      min: 'La hectareas debe ser mayor o igual a cero'
    },
    cantidadPotreros: {
      required: 'Requerido',
      min: 'La cantidad de potreros debe ser mayor o igual a cero'
    },
    phonePrefix: {
      required: 'Requerido'
    },
    phoneNumber: {
      required: 'Requerido'
    },
    mail: {
      required: 'Requerido',
      email: 'Formato de mail incorrecto',
      maxLength: 'El mail debe tener hasta 50 carateres'
    }
  };

  constructor(
    private coreService: CoreService,
    private localStorage: LocalStorage,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
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
      razonSocial: this.form.get('razonSocial').value,
      cuit: this.form.get('cuit').value,
      fecha: this.form.get('fecha').value,
      alias: this.form.get('alias').value,
      region: this.form.get('region').value,
      zona: this.form.get('zona').value,
      direccion: this.form.get('direccion').value,
      hectareas: this.form.get('hectareas').value,
      cantidadPotreros: this.form.get('cantidadPotreros').value,
      phonePrefix: this.form.get('phonePrefix').value,
      phoneNumber: this.form.get('phoneNumber').value,
      mobile: this.form.get('mobile').value,
      mail: this.form.get('mail').value
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

        this.localStorage.setItem('datosBasicos', p).subscribe(
          arg => {
            this.router.navigate(['/establecimiento/establecimientos']);
            this.coreService.setEstablecimiento(this.id);
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
      razonSocial: [
        this.razonSocial, 
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ]
      ],
      cuit: [
        this.cuit,
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]
      ],
      fecha: [this.fecha, [Validators.required]],
      alias: [
        this.alias, 
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ]
      ],
      region: [this.region, [Validators.required]],
      zona: [this.zona, [Validators.required]],
      direccion: [this.direccion, [Validators.required]],
      hectareas: [this.hectareas, [Validators.required,Validators.min(0)]],
      cantidadPotreros: [this.cantidadPotreros, [Validators.required,Validators.min(0)]],
      phonePrefix: [
        this.phonePrefix,
        [Validators.required, Validators.max(9999)]
      ],
      phoneNumber: [
        this.phoneNumber,
        [Validators.required, Validators.max(9999999)]
      ],
      mobile: [this.mobile],
      mail: [this.mail, 
        [
          Validators.email, 
          Validators.maxLength(50)
        ]
      ]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['razonSocial'].setValue('');
    form.controls['cuit'].setValue('');
    form.controls['fecha'].setValue('');
    form.controls['alias'].setValue('');
    form.controls['region'].setValue(0);
    form.controls['zona'].setValue(0);
    form.controls['direccion'].setValue('');
    form.controls['hectareas'].setValue(0);
    form.controls['cantidadPotreros'].setValue(0);
    form.controls['phonePrefix'].setValue('');
    form.controls['phoneNumber'].setValue('');
    form.controls['mobile'].setValue(true);
    form.controls['mail'].setValue('');

    if (this.id !== -1) {
      form.controls['razonSocial'].setValue(this.datoBasico['razonSocial']);
      form.controls['cuit'].setValue(this.datoBasico['cuit']);
      form.controls['fecha'].setValue(this.datoBasico['fecha']);
      form.controls['alias'].setValue(this.datoBasico['alias']);
      form.controls['region'].setValue(this.datoBasico['region']);
      form.controls['zona'].setValue(this.datoBasico['zona']);
      form.controls['direccion'].setValue(this.datoBasico['direccion']);
      form.controls['hectareas'].setValue(this.datoBasico['hectareas']);
      form.controls['cantidadPotreros'].setValue(
        this.datoBasico['cantidadPotreros']
      );
      form.controls['phonePrefix'].setValue(this.datoBasico['phonePrefix']);
      form.controls['phoneNumber'].setValue(this.datoBasico['phoneNumber']);
      form.controls['mobile'].setValue(this.datoBasico['mobile']);
      form.controls['mail'].setValue(this.datoBasico['mail']);
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

  cancel(){
    this.router.navigate(['../']);
  }
}
