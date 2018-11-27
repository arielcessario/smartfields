import { CoreService } from './../../core/core.service';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smf-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  ngOnInit() {}

  constructor(
    public authService: AuthenticationService,
    private coreService: CoreService
  ) {}

  logout() {
    this.coreService.setEstablecimiento(-1);
    this.authService.logout();
  }
}
