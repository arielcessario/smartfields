// import { AcCoreService } from '../ac-core.service';
// import { environment } from './../../../environments/environment';
import { DbHelperService } from './db-helper.service';
import { OnInit, Injectable, ReflectiveInjector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

import { CoreService } from './core.service';
// import { CacheService } from '../cache/cache.service';

@Injectable()
export class DbConnectService implements OnInit {
  private _dbHelper = new DbHelperService();
  private _baseUrl: string;

  constructor(
    private coreService: CoreService,
    private _http: Http // private config: AcCoreService
  ) {
    // if (this.config.getEnv() === 'prod') {
    // this._baseUrl = './assets/server/api.php';
    // } else {
    this._baseUrl = 'https://master.sgi.dev.automacity.com/api/';
    // }
  }

  ngOnInit() {}

  public get(obj: string, fnc: string, prm: any) {
    this.coreService.setLoadingStatus(true);

    // if (CacheService.get[obj] != null && CacheService.get[obj][fnc] != null) {
    //   return new BehaviorSubject(CacheService.get(obj, fnc));
    // }

    let header = {};

    if (localStorage.getItem('currentUser')) {
      header = {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token
        // 'App-Request': this.config.getCompany()
      };
    } else {
      header = {
        'Content-Type': 'application/json'
        // 'App-Request': this.config.getCompany()
      };
    }

    const options = new RequestOptions({ headers: new Headers(header) });

    const response = this._http.get(
      this._dbHelper.format(this._baseUrl, obj, fnc, prm),
      options
    );

    return response.pipe(
      map((data: Response) => {
        // console.log(data);
        return this.extractData(obj, fnc, data, this.coreService);
      }),
      catchError(
        (err: Response | any): any => {
          // console.log(err);
          return this.handleError(err, this.coreService);
        }
      )
    );
  }

  public post(obj: string, fnc: string, prm: any) {
    this.coreService.setLoadingStatus(true);
    let header = {};
    if (localStorage.getItem('currentUser') || prm['token_social']) {
      if (JSON.parse(localStorage.getItem('currentUser'))) {
        header = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Credentials': 'true',
          Authorization:
            'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token
          // 'App-Request': this.config.getCompany()
        };
      } else {
        header = {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Credentials': 'true',
          Authorization: 'Bearer ' + prm['token_social']
          // 'App-Request': this.config.getCompany()
        };
      }
    } else {
      header = {
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'App-Request': this.config.getCompany()
      };
    }

    const options = new RequestOptions({ headers: new Headers(header) });

    /// TODO: ARREGLAR POST PARA QUE USE LAS OPTIONS
    const response = this._http.post(
      this._baseUrl,
      this._dbHelper.formatPost(obj, fnc, prm),
      options
    );
    // const response = this._http.post(
    //   this._baseUrl,
    //   this._dbHelper.formatPost(obj, fnc, prm),
    //   options
    // );

    return response.pipe(
      map((data: Response) => {
        // console.log('Response: ', data);
        return this.extractData(obj, fnc, data, this.coreService);
      }),
      catchError((err: Response | any) => {
        // console.log(err);
        return this.handleError(err, this.coreService);
      })
    );

    // return '';
  }

  public delete(obj: string, fnc: string, prm: any) {}

  /**
   * Servicio que escucha por cambios realizados en el form.
   * @param data
   * @param form
   * @param formErrors
   * @param validationMessages
   */
  onValueChanged(
    data?: any,
    form?: any,
    formErrors?: any,
    validationMessages?: any
  ) {
    if (!form) {
      return;
    }
    // const form = form;
    for (let field = 0; field < formErrors.length; field++) {
      // clear previous error message (if any)
      formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = validationMessages[field];
        for (let key = 0; key < control.errors.length; key++) {
          formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  public extractData(obj: string, fnc: string, data: Response, coreService) {
    // console.log(data);

    if (data['_body'] !== '') {
      // console.log("Extract Data: ", data);

      const body = data.json() ? data.json()['data'] : data;
      // CacheService.set(obj, fnc, body);

      if (data['statusText'].indexOf('Expired') > -1) {
        this.coreService.logOut();
      }

      coreService.setLoadingStatus(false);
      return body || {};
    } else {
      coreService.setLoadingStatus(false);
      return {};
    }
  }

  private handleError(error: Response | any, coreService) {
    // console.log("Error: ", error);

    // In a real world app, you might use a remote logging infrastructure
    let _err_msg: string;
    let _err = {};
    if (error instanceof Response) {
      try {
        _err = JSON.parse(error['_body']);
        _err_msg = _err['body'];
      } catch (e) {
        _err_msg = error.toString();
      }

      // try {
      //     error.json();
      //     isJson = true;
      // } catch (e) {
      //     isJson = false;
      // }

      // const body = (isJson) ? error.json() : error['_body'];
      // err = body.error || JSON.stringify(body);
      // _err_msg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      _err_msg = error.message ? error.message : error.toString();
    }

    coreService.setToast({ type: 'error', title: 'Upppssss', body: _err_msg });
    coreService.setLoadingStatus(false);
    return throwError(_err_msg); // Observable.throw(_err_msg);
  }
}
