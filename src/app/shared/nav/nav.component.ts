import { CoreService } from './../../core/core.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { NbThemeService, NbSidebarService } from '@nebular/theme';
import { AuthenticationService } from '../../core/auth/authentication.service';

@Component({
  selector: 'smf-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  email: string;
  password: string;
  user: any;
  open = false;
  navOpen = '';
  position = 'left';
  userMenu = [];
  _theme = 'corporate';

  constructor(
    private router: Router,
    private themeService: NbThemeService,
    private nbSidebarService: NbSidebarService,
    private coreService: CoreService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

    this.setUser();
    this.coreService.getLoginStatus.subscribe(data => {
      // console.log('login status');
      this.setUser();
    });

    if (localStorage.getItem('THEME')) {
      this._theme = localStorage.getItem('THEME');
    } else {
      localStorage.setItem('THEME', 'corporate');
    }
    this.themeService.changeTheme(this._theme);

    this.coreService.setLoginStatus({
      isLogged: this.authenticationService.getLoginStatus()
    });

    this.router.events.subscribe(params => {
      if (params instanceof NavigationEnd) {
        if (params.url === '/login') {
          this.coreService.setLoginStatus({ isLogged: false });
        }
        // this.selected = params.snapshot.params['id'];
      }
    });
  }

  setUser() {
    Object.keys(localStorage).forEach((element, i, a) => {
      if (element.indexOf('firebase:authUser') > -1) {
        setTimeout(() => {
          this.user = JSON.parse(localStorage.getItem(element));
        }, 100);
      }
    });
  }

  changeTheme() {
    // this.themeService.changeTheme('cosmic');

    this._theme = localStorage.getItem('THEME');
    if (this._theme === 'default') {
      this.themeService.changeTheme('cosmic');
      localStorage.setItem('THEME', 'cosmic');
    } else if (this._theme === 'cosmic') {
      this.themeService.changeTheme('corporate');
      localStorage.setItem('THEME', 'corporate');
    } else if (this._theme === 'corporate') {
      this.themeService.changeTheme('default');
      localStorage.setItem('THEME', 'default');
    }
  }

  toggleSidebar() {
    this.nbSidebarService.toggle(true, (this.open = !this.open).toString());
  }

  goToHome() {
    this.router.navigate(['/main']);
  }
  goToPerfil() {
    this.router.navigate(['/perfil']);
  }
}
