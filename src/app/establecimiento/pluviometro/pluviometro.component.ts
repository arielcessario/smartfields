import { Router, NavigationEnd, Route, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CoreService } from './../../core/core.service';
import { Establecimiento, Permiso } from './../../model/types';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';

interface Marker {
  lat: number;
  lng: number;
  label?: any;
  iconUrl?: any;
  draggable: boolean;
}

declare var google;

@Component({
  selector: 'smf-pluviometro',
  templateUrl: './pluviometro.component.html',
  styleUrls: ['./pluviometro.component.scss']
})
export class PluviometroComponent implements OnInit {
  id = -1;

  pluviometro: any;

  form: FormGroup;
  private fb: FormBuilder;

  public description = '';
  public fechaInstalacion = new Date();

  lat = 51.678418;
  lng = 7.809007;

  formErrors = {
    description: '',
    fechaInstalacion: ''
  };

  validationMessages = {
    description: {
      required: 'Requerido',
      maxlength: 'Máximo 50 caracteres'
    },
    fechaInstalacion: {
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
      if (p.id) {
        this.id = p.id;
        this.localStorage
          .getItem<any>('pluviometros')
          .subscribe(pluviometros => {
            for (let i = 0; i < pluviometros.length; i++) {
              if ('' + pluviometros[i].id === '' + this.id) {
                this.pluviometro = pluviometros[i];
              }
            }
            this.lat = this.pluviometro.location.lat;
            this.lng = this.pluviometro.location.lng;
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

      this.markers[0] = {
        lat: this.lat,
        lng: this.lng,
        draggable: true
      };
    }
  }

  getMapClick(e) {
    // this.markers.push({
    //   lat: e.coords.lat,
    //   lng: e.coords.lng,
    //   draggable: false
    // });

    this.markers = [];

    this.markers.push({
      lat: e.coords.lat,
      lng: e.coords.lng,
      draggable: false
    });

    // this.lat = e.coords.lat;
    // this.lng = e.coords.lng;

    // this.refreshMarkers(e.coords.lat, e.coords.lng);
  }

  getMarkerPosition(e) {
    // this.refreshMarkers(e.latitude, e.longitude);
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
    } else {
      this.tempPaths.push({ lat: lat, lng: lng });
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
      description: this.form.get('description').value,
      fechaInstalacion: this.form.get('fechaInstalacion').value,
      location: { lat: this.markers[0].lat, lng: this.markers[0].lng }
    };
    this.localStorage.getItem<any>('pluviometros').subscribe(
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


        this.localStorage.setItem('pluviometros', p).subscribe(
          arg => {
            this.location.go('/establecimiento/pluviometro/' + this.id);
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
      description: [
        this.description,
        [Validators.required, Validators.maxLength(50)]
      ],
      fechaInstalacion: [this.fechaInstalacion, [Validators.required]]
    };

    this.fb = new FormBuilder();
    const form = this.fb.group(group);

    form.controls['description'].setValue('');
    form.controls['fechaInstalacion'].setValue('');

    if (this.id !== -1) {
      form.controls['description'].setValue(this.pluviometro['description']);
      form.controls['fechaInstalacion'].setValue(
        this.pluviometro['fechaInstalacion']
      );
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
