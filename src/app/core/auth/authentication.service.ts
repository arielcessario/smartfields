import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { CoreService } from '../core.service';
// import { AuthService } from "angular2-social-login";
import { DbConnectService } from '../db-connect.service';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Injectable()
export class AuthenticationService {
  public token: string;
  sub: Observable<Object>;
  ret: any;
  // constructor(){};
  constructor(
    private http: Http,
    // public _auth: AuthService,
    public dbConnectService: DbConnectService,
    public coreService: CoreService,
    public router: Router
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

  login(username: string, password: string){
    return true;
  }

  persistLogin(response) {
    // login successful if there's a jwt token in the response
    const token = response.token;
    const user = response.user;
    if (token) {
      // set token property
      this.token = token;

      // store username and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ user: user, token: token })
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
