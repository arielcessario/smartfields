import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, config } from 'rxjs';
import { CoreService } from '../core.service';
// import { AuthService } from "angular2-social-login";
import { DbConnectService } from '../db-connect.service';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Route, Router } from '@angular/router';
import { sha256, sha224 } from 'js-sha256';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from './../../../environments/environment';
import { Session } from 'src/app/model/session';

//const endpoint = 'https://master.sgi.dev.automacity.com/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

declare var jsSHA: any; 

@Injectable()
export class AuthenticationService {
  public token: string;
  sub: Observable<Object>;
  ret: any;
  jsSHA: any;
  shaObj:any;
  hash:string;
  deviceInfo = null;
  constructor(
    //private http: Http,
    // public _auth: AuthService,
    public dbConnectService: DbConnectService,
    public coreService: CoreService,
    public router: Router,
    private http: HttpClient,
    private deviceService: DeviceDetectorService
  ) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

  }

  // login(username: string, password: string): Observable<boolean> {
  //   return (this.ret = this.dbConnectService
  //     .post('usuarios', 'login', {
  //       mail: username,
  //       password: password,
  //       sucursal_id: -2
  //     })
  //     .pipe(
  //       map((response: Response) => {
  //         this.persistLogin(response);
  //       }),
  //       catchError((err: Response, caught: Observable<any>) => {
  //         this.coreService.setLoginStatus({ isLogged: false });
  //         return throwError(err);
  //       })
  //     ));
  // }

  login(username: string, password: string): Observable<boolean> {
    const hasherPwd = sha256(password);
    
    this.shaObj = new jsSHA("SHA-1", "TEXT");
    this.shaObj.update("hello@example.com");
    this.hash = this.shaObj.getHash("B64",{"b64Pad" : ""});
    const userHash = this.hash.replace('+', '-').replace('/', '_').replace('=', '');
    this.deviceInfo = this.deviceService.userAgent.substring(0,64);

    return this.http.post<any>(`${environment.apiUrl}` + '/users/'+userHash+'/sessions/',
        { passwd:hasherPwd, 
          persistence:0, 
          description: this.deviceInfo//, "Firefox 63 on Ubuntu 16.04"
        }, httpOptions)
        .pipe(
          map((response: Session) => {
            this.persistLogin(response);
          }),
          catchError((err: Response, caught: Observable<any>) => {
            this.coreService.setLoginStatus({ isLogged: false });
            return throwError(err);
          })
        );
  };

  persistLogin(response) {
    console.log(response);
    // login successful if there's a jwt token in the response
    // const token = response.token;
    // const user = response.user;
    // console.log(token);
    // console.log(user);
    if (response) {
      // set token property
      // this.token = token;

      // store username and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ session: response })
      );

      this.coreService.setLoginStatus({ isLogged: true });
      // return true to indicate successful login
      return true;
    } else {
      this.coreService.setLoginStatus({ isLogged: false });
      // return false to indicate failed login
      return false;
    }
  }

  getLoginStatus() {
    return (
      localStorage.getItem('currentUser') !== undefined &&
      localStorage.getItem('currentUser') !== null
    );
  }

  getLoginInfo() {
    return localStorage.getItem('currentUser');
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
    this.coreService.setLoginStatus({ isLogged: false });
    this.router.navigate(['/login']);
  }
}
