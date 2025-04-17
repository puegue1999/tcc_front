import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { PlatformModalsService } from 'src/app/services/modals/platform-modals.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TranslateServiceLocale } from './translate.service';
import { LocalStorageService } from 'src/app/services/localStorageService/local-storage.service';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss'],
  providers:[ConfirmationService]
})
export class TranslateComponent implements OnInit {
   @ViewChild('op',{static:true}) op: OverlayPanel;
   @ViewChild('btnelm',{static:true}) btnelm: ElementRef;

  translations: any = [];
  groups: any = [];
  selectedGroup: any;

  selectedItemPerPage: any = 6;
  filterTerm: string;
  pTranslations: number = 1;  
  group:any = '';
  locale: any = '';
  query: any = '';
  currentUrl: any;
  languages: any;
  selectedlanguage: any;

  translationForm: UntypedFormGroup;

  filterOpen: any = false;
  processing: boolean = false;    
  buttonUnlocked: boolean = false;
  selectUndefinedOptionValue:any = '';

  triggered:boolean;
  translationsPatchArray: any = [];

  displayBasic:boolean;
  textError: string;

  modalConfirmation$ = this.sharedService.modalConfirmation$;
  gcsInfraPath: any;

  subscription: Subscription;

  i18n: any = [];

  constructor(
    private router:Router,
    private primengConfig: PrimeNGConfig,
    private translateService: TranslateServiceLocale,
    private sharedService:SharedService,
    private FormBuilder: UntypedFormBuilder,
    private platModalService: PlatformModalsService,
    private localStorageService: LocalStorageService

  ) { }

  ngOnInit(): void {
    this.getTranslation();
    this.primengConfig.ripple = true;
    this.getUrl();
    this.createTranslateForm();
    this.getDeafaultLanguage();
    this.getTranslations(this.group, this.locale, this.query, true,()=>{});
    this.getGroups();
  }

  getTranslation(){
    this.i18n = {
      ...this.sharedService.getTranslationsOf('TranslationEditor')
    };
  }
  

  createTranslateForm(){
    this.translationForm = this.FormBuilder.group({})
  }


  getUrl(){
    console.log('this.router?.url ', this.router?.url);
    this.group = this.router?.url?.substring(this.router?.url?.indexOf('/')+1).split("/")[0];
    if (this.router?.url == '/disciplines-models') {
      this.group = 'disciplines';
    }
    this.currentUrl;//Seta o group vindo da URL
    this.selectedGroup = this.capitalizeFirstLetter(this.group);
  }


  getTranslations(group:any, locale:any, query:any, createInputs: boolean, callback:any) {

      this.translateService.getTranslations(group, locale, query)
      .subscribe({
        next: (translations) => {
          if (translations['exception'] !== undefined) {
            this.translations = [];
            callback();
          }else{
            this.translations = translations;
            let languages: any =  localStorage.getItem('languages');//recebe as linguagens definidas nos cookies
            languages = JSON.parse(languages);
            this.gcsInfraPath =  localStorage.getItem('gcsInfraPath');//recebe as linguagens definidas nos cookies
            //checa se é necessário a criação de novos inputs de acordo com o array translations
            if (createInputs == true) {
              let arr:any = {};
              this.translations.forEach((item:any)=> {
                arr[item.item] = this.FormBuilder.control('');
              });
              this.translationForm = this.FormBuilder.group(arr);
            }
            callback();
          }
  
        },
        error: (err) => {
          if (err.status == 404 && err.error.length == 0) {
            this.translations = [];
            return;
          }
          this.platModalService.toggle('message', err.error.error, 'close');
        } 
      });
  }     

  getGroups(){
    this.translateService.getGroups().subscribe((groups:any)=>{
      this.groups = groups;
    })
  }

  capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }  

  getDeafaultLanguage() {
    this.languages = JSON.parse(localStorage.getItem('languages') || '');

    //TO DO = A Linguagem padrão (Português) precisará vir de settings
    this.selectedlanguage = this.languages.find((language:any)=> language.name == "Português")
    this.locale = this.selectedlanguage?.locale;
  }

  // traz o arquivo de traduções para atualizar em tempo real o template
  getTranslationsFile(uri:any, locale: any){
    this.translateService.getTranslationsFile(uri, locale).subscribe( file => {
      localStorage.setItem('translations', JSON.stringify(file));

      //indica uma mudança no objeto do cookie de translations 
      // e envia um evento para as instancias serem atualizadas
      this.sharedService.updateTranslations(file);
    });
  }    


  // altera o status do botão salvar do formulário
  onKey() { 
    for (const key in this.translationForm.value) {
      const text = this.translationForm.value[key];
      if (text !== '' ) {
        this.buttonUnlocked = true;
        break;
      }else{
        this.buttonUnlocked = false;
      }
    }
  } 


  // Os HostListeners abaixo verificam se o filtro está aberto
  // identificando se o click acontece no botão do filtro ou fora do mesmo
  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    
    if (!this.btnelm.nativeElement.contains(event?.target) || !this.op?.el?.nativeElement.contains(event?.target)) {
      this.filterOpen = false;
    }
  } 

  @HostListener('click')
  clickInside(event:any) {
      if (event !== undefined) {
        event.stopPropagation();
        this.op.toggle(event, null)
        this.filterOpen = !this.filterOpen;
      }
  } 

  // Altera a linguagem do filtro
  changeLanguage(){
    this.locale = this.selectedlanguage?.locale;
    this.group = this.selectedGroup
    this.getTranslations(this.group, this.locale, this.query, true, ()=>{
      this.pTranslations = 1;
    }) 
  }

  // Altera o grupo do filtro
  changeGroup(){
    this.locale = this.selectedlanguage?.locale;
    this.group = this.selectedGroup
    this.getTranslations(this.group, this.locale, this.query, true, ()=>{
      this.pTranslations = 1;
    })    
  }

  isSaved: boolean = false;

	closeModal(){
		this.sharedService.modalCloseTranslate();
    if (this.isSaved) {
      location.reload();
    }
	} 


  //Os dois HostListeners abaixo são pra pevenir múltiplos disparos de eventos.
  //E não permitir o push da tradução mais de uma vez pra dentro do array
  @HostListener('focusout', ['$event'])
  focusOut(event:any){
    if (this.triggered) {
      return;
    }
    if (event.target instanceof HTMLInputElement) {//checa se o target é um input
      if (event.srcElement.id !== "") {//checa se o input tem id preenchido
        if (this.translationsPatchArray.length > 0) {//checa se o array já está preenchido
          this.translationsPatchArray.forEach((element:any) => {
            if (parseInt(event.srcElement.id) == element.id) {//verifica se já existe o id da tradução 
              let index = this.translationsPatchArray.indexOf(element);
              this.translationsPatchArray.splice(index, 1);//elimina o id já existente
            }
          });
        }
        const param = {
          "id":parseInt(event.srcElement.id),
          "text": event.srcElement.value
        }
        this.translationsPatchArray.push(param);
      }
    }
    this.triggered = true;    
  }


  @HostListener('focusin', ['$event']) 
  focusIn(event:any) {
    if (event.target instanceof HTMLInputElement) {
      this.triggered = false;    
    }    

  }




  patchGeneralSettings(){
    this.processing = true;
    this.buttonUnlocked = false;

    let arr:any = [];
    
    for (let index = 0; index < this.translationsPatchArray.length; index++) {
      const text = this.translationsPatchArray[index].text;
      const id = this.translationsPatchArray[index].id;
      
      if (text == '' || text == null ) {
      }else{
        const param = {
          "id": id,
          "text": text
        }
        arr.push(param);

      }
      
    }
           
    this.translateService.patchTranslations(arr)
    .subscribe({
      next:(res)=>{
        
        // [{"id":4637,"group":"Disciplines","item":"disciplines_add","text":"Add","locked":1,"locale":"pt-BR"}]
        this.buttonUnlocked = false;
        this.processing = false;
        // this.sharedService.modalOpenConfirmation();
        this.isSaved = true;
        let translations = JSON.parse(localStorage.getItem('translations') || '') ;
        
        if (translations !== '') {
          res.forEach(element => {
            translations[element.group][element.item] = element.text;
          });
        }
        this.getTranslations(this.group, this.locale, this.query, false,()=>{
          localStorage.setItem('translations',JSON.stringify(translations));
          this.translationForm.reset();
          this.translationsPatchArray = [];
          // this.getTranslationsFile(this.gcsInfraPath, this.locale);
        });        
      },
      error:(err)=>{
        this.platModalService.toggle('message', err.error.error, 'close');
        this.buttonUnlocked = false;
      }
    });
  }   

  searchTranslations(){
    // if (this.query == '') {//reseta busca
    //   this.group = '';
    // }
    this.getTranslations(this.group, this.locale, this.query, true, ()=>{});
    
  }    

}
