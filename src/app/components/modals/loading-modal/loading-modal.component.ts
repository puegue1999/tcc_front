import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { PlatformModalsService } from 'src/app/services/modals/platform-modals.service';
import { SharedService } from 'src/app/shared/shared.service';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';
@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent implements OnInit {
  @ViewChild(GenericModalComponent) generic_modal: GenericModalComponent;

  @Input() isVisible;

  private i18n: any;
  translations: any = {};

  constructor(
    private platModalService: PlatformModalsService,
    private sharedService: SharedService
    ) {};

 ngOnInit(): void {
    this.getI18n();
    this.extractTextFromI18n();
    this.subscribeToModalService();
  }

  private getI18n () {
    this.i18n = this.sharedService.getTranslationsOf('Modal');
    this.i18n = this.i18n.loading_subject_generic
  }

  private extractTextFromI18n () {
    const [boldText, lightText] = this.i18n.split('|');

    this.translations.boldText = boldText;
    this.translations.lightText = lightText;
  }

  private subscribeToModalService () {
    this.platModalService.getModalState('loading').pipe(delay(0)).subscribe(boolean => {
      if (this.isVisible === undefined) this.generic_modal.toggle(boolean);
    });
  }
}
