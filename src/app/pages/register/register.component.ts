import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateServiceLocale } from '../../components/translate/translate.service';
import { PlatformModalsService } from '../../services/modals/platform-modals.service';
import { SharedService } from '../../shared/shared.service';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  show = false;
  userHasToken = false;
  hasTokenPartner = false;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private registerService: RegisterService,
    private translateServiceLocale: TranslateServiceLocale,
    private sharedService: SharedService,
    public platModalService: PlatformModalsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.show = true;
  }

  getTokenStatus() {
    const route = this.route.snapshot.queryParams;

    if (Object.prototype.hasOwnProperty.call(route, 'token_partner')) {
      this.hasTokenPartner = true;
      localStorage.removeItem('token');
    }
    if (
      this.sharedService.fnUserHasToken() &&
      this.sharedService.fnUserHasValidToken()
    ) {
      this.userHasToken = true;
    }
  }

  updateUser() {
    this.registerService.register().subscribe((data) => {
      console.log(data);
    });
  }

  toLogin() {
    this.router.navigate(['login']);
  }
}
