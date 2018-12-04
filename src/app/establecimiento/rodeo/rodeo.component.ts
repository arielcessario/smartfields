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
  selector: 'smf-rodeo',
  templateUrl: './rodeo.component.html',
  styleUrls: ['./rodeo.component.scss']
})
export class RodeoComponent implements OnInit {
  form: FormGroup;
  private fb: FormBuilder;
  rodeo: any;
  id = -1;

  public nroRodeo = '';
  public ambientes = '';
  public hectareas = '';

  formErrors = {
    nroPotrero: '',
    ambientes: '',
    hectareas: ''
  };
  constructor() { }

  ngOnInit() {
  }

}
