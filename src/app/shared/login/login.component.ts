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
    // console.log('entra');
  }

  login() {
    // this.authenticationService.login(this.mail, this.password).subscribe(resp =>{
    //   console.log(resp);
    // });
    if (this.authenticationService.login(this.mail, this.password)) {
      this.authenticationService.persistLogin({
        token: 'aaaaaaaaaaaaaaaaaa',
        user: 'Ariel Cessario'
      });
      this.router.navigate(['establecimiento', 'establecimientos']);
    }
  }
}
