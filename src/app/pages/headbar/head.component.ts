import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PlatformModalsService } from '../../services/modals/platform-modals.service';
import { SharedService } from '../../shared/shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
  standalone: false,
})
export class HeadComponent implements OnInit {
  constructor(
    private router: Router,
    private sharedService: SharedService,
    public platModalService: PlatformModalsService,
    private route: ActivatedRoute,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {
    this.checkUser();
  }

  checkUser() {
    // Checa se o usuário está logado verificando se existe um token criado no cookie
    if (localStorage.getItem('token') !== null) {
      this.sharedService.loggedIn.next(true);
    }
  }
}
