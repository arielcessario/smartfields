import { AuthenticationService } from './../../core/auth/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'smf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  password = '';
  mail = '';
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  login() {
    // if (this.authenticationService.login(this.mail, this.password)) {
    //   this.authenticationService.persistLogin({
    //     token: 'aaaaaaaaaaaaaaaaaa',
    //     user: 'Ariel Cessario'
    //   });
    //   this.router.navigate(['establecimiento', 'establecimientos']);
    // }
    this.authenticationService.login(this.mail, this.password)
    .subscribe(
      resp=>
      {
        this.authenticationService.persistLogin({
              resp
            });
            this.router.navigate(['establecimiento', 'establecimientos']);
      });  
  }
}
