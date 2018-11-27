import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CoreService } from './../../core/core.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
declare var google;

interface Marker {
  lat: number;
  lng: number;
  label?: any;
  iconUrl?: any;
  draggable: boolean;
}

@Component({
  selector: 'smf-ambiente',
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.scss']
})
export class AmbienteComponent implements OnInit {
  id = -1;

  ambiente: any;

  form: FormGroup;
  private fb: FormBuilder;

  public tipo = 0;
  public cobForrajera = 0;
  public hectareas = 0;
  public bebederos = 0;
  public coeficiente = 0;
  public disponibilidad = 0;
  public pluviometro = 0;

  lat = 51.678418;
  lng = 7.809007;

  formErrors = {
    tipo: '',
    cobForrajera: ''
  };

  validationMessages = {
    tipo: {
      required: 'Requerido',
      maxlength: 'Máximo 50 caracteres'
    },
    cobForrajera: {
      required: 'Requerido'
    },
    hectareas: {
      required: 'Requerido'
    },
    bebederos: {
      required: 'Requerido'
    },
    coeficiente: {
      required: 'Requerido'
    },
    disponibilidad: {
      required: 'Requerido'
    },
    pluviometro: {
      required: 'Requerido'
    }
  };

  markers: Marker[] = [];

  paths = [];
  tempPaths = [];
  protected map: any;

  constructor(
    private coreService: CoreService,
    private localStorage: LocalStorage,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe((p: { id: number }) => {
      if (p.id && p.id != -1) {
        this.id = p.id;
        this.localStorage.getItem<any>('ambientes').subscribe(ambientes => {
          for (let i = 0; i < ambientes.length; i++) {
            if ('' + ambientes[i].id === '' + this.id) {
              this.ambiente = ambientes[i];
            }
          }
          this.lat = this.ambiente.location.lat;
          this.lng = this.ambiente.location.lng;
          this.buildForm();
        });
      } else {
        this.getLocation();
        this.buildForm();
      }
    });
  }

  protected mapReady(map) {
    this.map = map;
    this.map.setZoom(15);
    this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);

    setTimeout(() => {
      this.showPosition();
    }, 1000);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.showPosition();
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  showPosition() {
    if (this.map) {
      this.map.setCenter({
        lat: this.lat,
        lng: this.lng
      });

      // this.markers.push({
      //   lat: this.lat,
      //   lng: this.lng,
      //   draggable: true
      // });
    }
  }

  getMapClick(e) {
    // this.markers.push({
    //   lat: e.coords.lat,
    //   lng: e.coords.lng,
    //   draggable: false
    // });

    // this.markers = [];

    // this.markers.push({
    //   lat: e.coords.lat,
    //   lng: e.coords.lng,
    //   draggable: false
    // });

    // this.lat = e.coords.lat;
    // this.lng = e.coords.lng;

    this.refreshMarkers(e.coords.lat, e.coords.lng);
  }

  getMarkerPosition(e) {
    this.refreshMarkers(e.latitude, e.longitude);
  }

  refreshMarkers(lat, lng) {
    let encontrado = -1;

    for (let i = 0; i < this.tempPaths.length; i++) {
      if (this.tempPaths[i].lat === lat && this.tempPaths[i].lng === lng) {
        encontrado = i;
      }
    }

    if (encontrado > -1) {
      this.tempPaths.splice(encontrado, 1);
      this.markers.splice(encontrado, 1);
    } else {
      this.tempPaths.push({ lat: lat, lng: lng });
      this.markers.push({
        lat: lat,
        lng: lng,
        draggable: false
      });
    }

    this.paths = [];
    if (this.tempPaths.length > 2) {
      setTimeout(() => {
        this.paths = this.tempPaths;

        const bounds = [];
        for (let i = 0; i < this.paths.length; i++) {
          bounds.push(
            new google.maps.LatLng(this.paths[i].lat, this.paths[i].lng)
          );
        }
        const area = google.maps.geometry.spherical.computeArea(bounds);
      }, 0);
    }
  }

  submit() {
    const plu = {
      id: this.id,
      tipo: this.form.get('tipo').value,
      cobForrajera: this.form.get('cobForrajera').value,
      location: { lat: this.markers[0].lat, lng: this.markers[0].lng }
    };
    this.localStorage.getItem<any>('ambientes').subscribe(
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

        this.localStorage.setItem('ambientes', p).subscribe(
          arg => {
            this.location.go('/establecimiento/ambiente/' + this.id);
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
      tipo: [this.tipo, [Validators.required, Validators.maxLength(50)]],
      cobForrajera: [this.cobForrajera, [Validators.required]],
      hectareas: [this.hectareas, [Validators.required]],
      bebederos: [this.bebederos, [Validators.required]],
      coeficiente: [this.coeficiente, [Validators.required]],
      disponibilidad: [this.disponibilidad, [Validators.required]],
      pluviometro: [this.pluviometro, [Validators.required]]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['tipo'].setValue(0);
    form.controls['cobForrajera'].setValue(0);
    form.controls['hectareas'].setValue(0);
    form.controls['bebederos'].setValue(0);
    form.controls['coeficiente'].setValue(0);
    form.controls['disponibilidad'].setValue(0);
    form.controls['pluviometro'].setValue(0);

    if (this.id !== -1) {
      form.controls['tipo'].setValue(this.ambiente['tipo']);
      form.controls['cobForrajera'].setValue(this.ambiente['cobForrajera']);
      form.controls['hectareas'].setValue(this.ambiente['hectareas']);
      form.controls['bebederos'].setValue(this.ambiente['bebederos']);
      form.controls['coeficiente'].setValue(this.ambiente['coeficiente']);
      form.controls['disponibilidad'].setValue(this.ambiente['disponibilidad']);
      form.controls['pluviometro'].setValue(this.ambiente['pluviometro']);
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
}
