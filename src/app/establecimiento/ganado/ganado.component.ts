import { LocalStorage } from '@ngx-pwa/local-storage';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'smf-ganado',
  templateUrl: './ganado.component.html',
  styleUrls: ['./ganado.component.scss']
})
export class GanadoComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  ganado: any;
  id = -1;

  public nroGanado = 0;
  public fechaNacimiento = '';
  public raza = [];
  public sexo = [];
  public categoria = [];
  public estado = [];
  public peso = 0;
  public castracion = '';
  public rodeo = [];

  formErrors = {
    nroGanado: '',
    fechaNacimiento: '',
    raza: '',
    sexo: '',
    categoria: '',
    estado: '',
    peso: '',
    castracion: '',
    rodeo: ''
  };

  validationMessages = {
    nroGanado: {
      required: 'Requerido',
      min: 'El Nro debe tener ser mayor o igual a 0'
    },
    fecha: {
      required: 'Requerido',
      maxlength: 'Maximo 10 caracteres',
    },
    raza: {
      required: 'Requerido',
    },
    sexo: {
      required: 'Requerido',
    },
    categoria: {
      required: 'Requerido',
    },
    estado: {
      required: 'Requerido',
    },
    peso: {
      required: 'Requerido',
      min: 'La hectareas debe ser mayor o igual a cero'
    },
    rodeo: {
      required: 'Requerido',
    }
  };

  constructor(private coreService: CoreService,
    private localStorage: LocalStorage,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,) { }

  ngOnInit() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id) {
        this.id = p.id;
        this.localStorage
          .getItem<any>('ganados')
          .subscribe(ganados => {
            for (let i = 0; i < ganados.length; i++) {
              if ('' + ganados[i].id === '' + this.id) {
                this.ganado = ganados[i];
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
      nroGanado: this.form.get('nroGanado').value,
      fechaNacimiento: this.form.get('fechaNacimiento').value,
      raza: this.form.get('raza').value,
      sexo: this.form.get('sexo').value,
      categoria: this.form.get('categoria').value,
      estado: this.form.get('estado').value,
      peso: this.form.get('peso').value,
      rodeo: this.form.get('rodeo').value,
      castracion: this.form.get('castracion').value
    };

    this.localStorage.getItem<any>('ganados').subscribe(
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

        this.localStorage.setItem('ganados', p).subscribe(
          arg => {
            this.location.go('/establecimiento/ganados/' + this.id);
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

    const group: any = {
      nroGanado: [
        this.nroGanado, 
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      fechaNacimiento: [
        this.fechaNacimiento,
        [
          Validators.required
        ]
      ],
      raza: [this.raza, [Validators.required]],
      sexo: [this.sexo, [Validators.required]],
      categoria: [this.categoria, [Validators.required]],
      estado: [this.estado, [Validators.required,Validators.min(0)]],
      peso: [this.peso, [Validators.required,Validators.min(0)]],
      rodeo: [this.rodeo,[Validators.required]],
      castracion: [this.castracion]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['nroGanado'].setValue('');
    form.controls['fechaNacimiento'].setValue('');
    form.controls['raza'].setValue(0);
    form.controls['sexo'].setValue(0);
    form.controls['categoria'].setValue(0);
    form.controls['estado'].setValue(0);
    form.controls['peso'].setValue(0);
    form.controls['rodeo'].setValue('');
    form.controls['castracion'].setValue(false);
       
    if (this.id !== -1) {
      form.controls['nroGanado'].setValue(this.ganado['nroGanado']);
      form.controls['fechaNacimiento'].setValue(this.ganado['fechaNacimiento']);
      form.controls['raza'].setValue(this.ganado['raza']);
      form.controls['sexo'].setValue(this.ganado['sexo']);
      form.controls['categoria'].setValue(this.ganado['categoria']);
      form.controls['estado'].setValue(this.ganado['estado']);
      form.controls['peso'].setValue(this.ganado['peso']);
      form.controls['rodeo'].setValue(this.ganado['rodeo']);
      form.controls['castracion'].setValue(this.ganado['castracion']);
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
    this.router.navigate(['establecimiento', 'ganados']);
  }

}
