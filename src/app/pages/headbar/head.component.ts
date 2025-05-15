import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PlatformModalsService } from '../../services/modals/platform-modals.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
  standalone: false
})
export class HeadComponent implements OnInit {
  constructor(
    private router: Router,
    private sharedService: SharedService,
    public platModalService: PlatformModalsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

  }

}
