import { ElementRef, Injectable, NgZone, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';

import jwt_decode from "jwt-decode";
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateServiceLocale } from '../components/translate/translate.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { PlatformModalsService } from '../services/modals/platform-modals.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})

export class SharedService {
  discipline$: Subject<any[]> = new Subject();
  user: any;
  assignment = new BehaviorSubject('');
  section = new BehaviorSubject('');
  content = new BehaviorSubject('');
  isShowing$ = new Subject<boolean>();
  modalOpen$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  isLoadedUpload$ = new BehaviorSubject<boolean>(false);
  modalOpenTranslate$ = new BehaviorSubject<boolean>(false);
  modalConfirmation$ = new BehaviorSubject<boolean>(false);
  createTranslateButton$ = new BehaviorSubject<boolean>(false);
  translationsUpdate$ = new BehaviorSubject({});
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isChangeCoverImg$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  impersonating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userHasToken: any;
  selectedLanguage: string;
  renderer: Renderer2;
  bodyEventListenersKeyList: any = {};
  editConcept$ = new BehaviorSubject({});
  removeFiles$ = new BehaviorSubject<any>({});

  private resourceSubject = new Subject<any>();

  routerEvents$;

  files$ = new BehaviorSubject<any>([]);

  removeGlobalScript$ = new Subject<boolean>();


  constructor(
    private rendererFactory: RendererFactory2,
    private router: Router,
    private translateServiceLocale: TranslateServiceLocale,
    private _ngZone: NgZone,
    private breakpointObserver: BreakpointObserver,
    public platModalService: PlatformModalsService,
    private toastr: ToastrService
  ) {
    this.onRouteChange();
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  fnUserHasToken(): boolean {
      return localStorage.getItem('token') !== null;
  }

  fnUserHasValidToken(): boolean {
    const tmpUser = this.getUserSync();
    // Check the expiration time (exp) in the payload
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (tmpUser.exp && tmpUser.exp < currentTimestamp) {
        return false;
    }
    return true;
    }

  fnRequestedValidationCode(){
    if (localStorage.getItem('codeValidation') !== null && localStorage.getItem('email') !== null) {
      return true;
    } else {
      return false;
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

    logOut<T>(queryParams?: T) {
        this.deleteKeyLocalStorage('token');
        this.deleteKeyLocalStorage('permissions');
        this.deleteKeyLocalStorage('searchKeys');
        this.loggedIn.next(false);
        this.impersonating.next(false);

        this._ngZone.runOutsideAngular(() => {
            this._ngZone.run(() => {
                this.router.navigate([''], { queryParams: { returnUrl: queryParams } });
            });
        });
    }

  checkTranslateActive() {

    if (localStorage.getItem('translateRealTime') !== null) {

      const data: any = localStorage.getItem('translateRealTime');
      if (data == 'true') {
        this.activateTranslateButton();
      } else {
        this.deactivateTranslateButton();
      }
    } else {
      this.deactivateTranslateButton();
    }
  }

  setSelectedLanguage(locale) {
    localStorage.setItem('currentLanguage', locale);
  }

  getSelectedLanguage(): string {

    // Busca língua selecionada no sistema
    let localStorageLang = localStorage.getItem('currentLanguage') || 'null';

    // Checa se a linguagem em localStorage existe no sistema
    if (
      localStorageLang !== 'null' &&
      localStorageLang !== 'en' &&
      localStorageLang !== 'es' &&
      localStorageLang !== 'pt-BR'

     ) {
      // busca a linguagem do navegador
      const userBrowserCurrentLanguage: string = this.languageFallback();
      // insere no localStorage
      this.setSelectedLanguage(userBrowserCurrentLanguage);
      // atualiza o valor da variável
      localStorageLang = localStorage.getItem('currentLanguage') || 'null';
    }

    // Verifica se existe alguma linguagem e retorna
    if (
      localStorageLang !== 'null' &&
      localStorageLang !== null &&
      localStorageLang !== undefined &&
      localStorageLang !== ''
    ) {
      return localStorage.getItem('currentLanguage') || 'null';
    } else {// Se não existir retorna língua padrão do navegador
      const userBrowserCurrentLanguage: string = this.languageFallback();
      this.setSelectedLanguage(userBrowserCurrentLanguage);
      return userBrowserCurrentLanguage;
    }
  }

  languageFallback(): string{
    let userBrowserCurrentLanguage = '';

    // Verifica qual a língua padrão do navegador
    // se for diferente a padrão é pt-BR
    switch (true) {
      case navigator.language.startsWith('pt'):
        userBrowserCurrentLanguage = 'pt-BR';
        break;
      case navigator.language.startsWith('en'):
        userBrowserCurrentLanguage = 'en';
        break;
      case navigator.language.startsWith('es'):
        userBrowserCurrentLanguage = 'es';
        break;
      default:
        userBrowserCurrentLanguage = 'pt-BR';
        break;
    }

    return userBrowserCurrentLanguage;
  }

  getTranslationsFile(locale: any, reload?, callback?) {
    const uri = localStorage.getItem('gcsInfraPath');
    this.translateServiceLocale.getTranslationsFile(uri, locale)
    .subscribe({
      next: (file)=> {
        localStorage.setItem('translations', JSON.stringify(file));

        setTimeout(() => {
            location.reload();
        }, 1000);
    },
      error:(error)=>{
        this.throwError('Error while trying to get translations file');
      }
    });

    this.setSelectedLanguage(locale);
  }

  //Registra evento de Traduções
  updateTranslations(translationsFile: any) {
    this.translationsUpdate$.next(translationsFile);
  }

  // controle de ativação do botão de traduções
  activateTranslateButton() {
    this.createTranslateButton$.next(true);
  }

  deactivateTranslateButton() {
    this.createTranslateButton$.next(false);
  }

  // controle de abertura e fechamento modal de traduções
  modalOpenTranslate() {
    this.modalOpenTranslate$.next(true);
  }

  modalCloseTranslate() {
    this.modalOpenTranslate$.next(false);
  }

  // controle de abertura e fechamento Modal de Loading
  isLoadingModalOpen() {
    this.isLoading$.next(true);
  }

  isLoadingModalClose() {
    this.isLoading$.next(false);
  }

  // controle de abertura e fechamento Modal
  modalOpen() {
    this.modalOpen$.next(true);
  }

  modalClose() {
    this.modalOpen$.next(false);
  }

  isLoadedUploadTrue() {
    this.isLoadedUpload$.next(true);
  }
  isLoadedUploadfalse() {
    this.isLoadedUpload$.next(false);
  }

  // controle de ModalConfirmation
  modalOpenConfirmation() {
    this.modalConfirmation$.next(true);
  }

  modalCloseConfirmation() {
    this.modalConfirmation$.next(false);
  }

  // controle de ModalInfo
  private modalInfoState = new BehaviorSubject<{ isOpen: boolean, status: string, message?: string }>({ isOpen: false, status: 'success', message: '' });

  getModalInfoState(): Observable<{ isOpen: boolean, status: string, message?: string }> {
      return this.modalInfoState.asObservable();
  }

  openInfoModal(status: string, message?: string): void {
      this.modalInfoState.next({ isOpen: true, status, message });
  }

  closeInfoModal(): void {
    this.modalInfoState.next({ isOpen: false, status: this.modalInfoState.value.status });
  }

  // controle para avisar que a imagem do banner da turma foi alterada

  isChangedCoverImg() {
    this.isChangeCoverImg$.next(true);
  }

  //Registra evento de Disciplina
  getDiscipleObservable(): Observable<any[]> {
    return this.discipline$.asObservable();
  }

  //Registra evento de Conteúdo
  sharedIsShowing = this.isShowing$.asObservable();

  //Registra evento de Conteúdo
  sharedAssignment = this.assignment.asObservable();

  getIsShowing(teste: boolean) {
    this.isShowing$.next(teste);
  }


  getAssignment(assignment: string) {
    this.assignment.next(assignment)
  }

  //Registra evento de Conteúdo
  sharedContent = this.content.asObservable();
  sharedSection = this.section.asObservable();

  getContent(content: any, section: string) {
    this.content.next(content);
    this.section.next(section);
  }

  //Registra evento de Usuário
  getUser(): Observable<any[]> {
    const data: any = localStorage.getItem('token');
    if(data){
      this.user = jwt_decode(data);
    }
    return of(this.user);
  }

  getUserSync (): any {
    const data: any = localStorage.getItem('token');
    return jwt_decode(data);
  }

  onRouteChange() {
    this.routerEvents$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
  }

  CallFunctionOnRouteChange(fn?: any) {
    if (fn) {
      this.routerEvents$.subscribe(fn)
    } else {
      if (this.routerEvents$) {
        this.routerEvents$.unsubscribe()
      }
    }
  }

  callFunctionsOnBreakpoint(breakpoint: string, { element, queryString, after, before }: any) {
    const uniqueKey = Symbol();

    if (breakpoint === 'infinite') breakpoint = '10000px';
    else if (!breakpoint) return Symbol(undefined);
    else if (after && before) {
      (this as any)[uniqueKey] = this.breakpointObserver
        .observe([`(max-width: ${breakpoint})`])
        .subscribe((state: BreakpointState) => state.matches ? after() : before());

    } else {

      const $element = element.nativeElement.querySelector(queryString);
      const elementClassList = $element.classList;

      (this as any)[uniqueKey] = this.breakpointObserver
        .observe([`(max-width: ${breakpoint})`])
        .subscribe((state: BreakpointState) => state.matches ? elementClassList.add('query') : elementClassList.remove('query'));

    }

    return uniqueKey;
  }

  removeBreakpointObserver(uniqueKey: symbol) {
    const observer = (this as any)[uniqueKey];

    if (observer) {
      observer.unsubscribe();
      return true;
    }

    return false;
  }

  deleteKeyLocalStorage(key: string) {
    if (localStorage.getItem(key)) localStorage.removeItem(key);
  }

  replaceLinkFile(files: any) {
    // correção para mostrar arquivo do upload em nova página
    if (files !== null && files !== undefined) {
      if (files.length) {
        files.map((item: any) => {
          item['path'] = 'https://drive.google.com/file/d/' + item.path + '/preview?usp=sharing';

          // if (!item.mime_type.includes('document') && !item.mime_type.includes('spreadsheet')) {
          //   item['path'] = 'https://drive.google.com/uc?id=' + item.path;
          // }

          // if (item.mime_type == "application/vnd.google-apps.document") {
          //   item['path'] = 'https://drive.google.com/file/d/' + item.path + '/preview?usp=sharing';
          // }

          // if (item.mime_type == 'application/vnd.google-apps.spreadsheet') {
          //   item['path'] = 'https://drive.google.com/file/d/' + item.path + '/preview?usp=sharing';
          // }

        });
      }
    }
  }

  selectMimeTypeToExport(file: any){
    if (file !== null && file !== undefined) {
      if (file.mime_type == "application/vnd.google-apps.document") {
        return 'application/pdf';
      }

      if (file.mime_type == 'application/vnd.google-apps.spreadsheet') {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      if (file.mime_type == 'application/vnd.google-apps.presentation') {
        return 'application/pdf';
      }

    }
  }

  fnIsImpersonating(impersonate: any) {
    localStorage.setItem('token', impersonate.token);
    localStorage.setItem('permissions', JSON.stringify(impersonate.permissions));
    this.router.navigate(['dashboard']);
    setTimeout(() => location.reload(), 100);
  }

  getTranslationsOf(module) {
    let errorMessage: any;
    if (localStorage.getItem('translations') === null) {
      errorMessage = 'translations were not found in localStorage'
      return this.throwError(errorMessage);
    }
    const translations = JSON.parse(localStorage.getItem('translations') || '');
    const moduleTranslations = translations[module];
    errorMessage = `Translations for '${module}' module were not found`;
    return (translations && moduleTranslations)
      ? moduleTranslations
      : this.throwError(errorMessage);
  }

  setI18n(componentReference, module: string) {
    componentReference.i18n = this.getTranslationsOf(module);
  }

  getLocaleDate (date: Date) {
    date = new Date(date);
    const localeFallback = 'en';
    const userLanguage = this.getSelectedLanguage();
    return date.toLocaleDateString([userLanguage, localeFallback]);
  }

  throwError(message: string) {
    throw new Error(message);
  }

  //Esta função vai lhe retornar um symbol quando executar ela pela primeira vez dentro do component, armazene esse symbol dentro de uma váriavel global (ex: dropdownKey: symbol), essa é a sua chave para matar o listener quando seu component for destruído (caso isso não aconteça o sistema inteiro vai ficar lento). No seu component, você deve criar o ngOnDestroy e nele executar esta mesma função com apenas 1 parâmetro, o symbol que você armazenou globalmente dentro do component (dropdownKey) quando chamou a função pela primeira vez, ao fazer isso a função pega a chave que você deu (o symbol) e usa ela para acessar o listener e remove-lo do body, caso contrário o sistema vai sofrer com muita perda de performance, essa função é muito útil, mas use ela com sabedoria, dê uma olhada na implementação dentro do single-choice-dropdown.component.ts
  toCloseWhenClickOutside (
    className: string | symbol,//Recebe o nome da classe para fazer a verificação
    $element?: ElementRef | any,//A referência do elemento (@ViewChild) para fazer mais outra verificação e extrair o element body
    params?: { _this: any, propertyToBeToggled: string }//A referência this do seu componente e o nome da propriedade booleana do seu elemento
  ): symbol {
    const _this = params?._this;
    const propertyToBeToggled = params?.propertyToBeToggled || '';
    const keyToRemoveListener = typeof className === 'symbol' ? className : null;

    if (keyToRemoveListener !== null) return this.bodyEventListenersKeyList.body.removeEventListener('click', this.bodyEventListenersKeyList[keyToRemoveListener]);

    const body = $element.nativeElement.closest('body');
    if (!this.bodyEventListenersKeyList.body) this.bodyEventListenersKeyList.body = body;

    function listener (event)  {
      const $foundElement = event.target.closest(className);
      const foundElementDataId = $foundElement ? $foundElement.getAttribute('data-id') : false;
      const originalElementDataId = $element.nativeElement.getAttribute('data-id');
      const clickedInside = $foundElement && (foundElementDataId === originalElementDataId);

      if (clickedInside) return;

      _this[propertyToBeToggled] = false;
      $element.nativeElement.scrollTop = 0;
    }


    const symbol = Symbol();
    this.bodyEventListenersKeyList[symbol] = listener;

    body.addEventListener('click', listener);

    return symbol;
  }
  storeUserCredentials(response:any){
    if (response.hasOwnProperty('permissions')) {
      localStorage.setItem('permissions',JSON.stringify(response.permissions))
    }
    if (response.hasOwnProperty('token')) {
      localStorage.setItem('token',response.token);
      this.setCurrentLanguage(response.token);
    }
  }

  setCurrentLanguage(token: any) {
    const user = jwt_decode<{ language?: string }>(token);

    if (!user.language) return;

    const currentLnguage = localStorage.getItem('currentLanguage') || '';

    if (currentLnguage !== user.language) {
      localStorage.setItem('currentLanguage', user.language);
      this.getTranslationsFile(user.language);
    }
  }

  // Busca a primeira permissão que tem autorização de acesso
  getFirstPermissionAvailable(permission, type: string){
    const permissions = this.getPermissions()
    const arrPermissions = Object.keys(permissions)

    const condition:any = arrPermissions.filter((key:any)=>key.startsWith(permission))
    const arrToApply: any = [];
    condition.forEach((item:any)=>{
      if (this.checkPermission(item, type)) {
        arrToApply.push(item);
      }
    })

    return arrToApply;
  }

  // Busca as permissões
  getPermissions(){
    if (localStorage.getItem('permissions') !== null) {
        return JSON.parse(localStorage.getItem('permissions') || '')
    }

    return null;
  }

  // Verifica se existe a permissão
  checkPermission(permission:any, type: any) {
    const permissions = this.getPermissions();
    // console.log('PERMISSION', permission);

    if (!permission || !type || !permissions[permission]) return false;

    const userHasPermission = Boolean(permissions[permission][permission.toString()+'.'+type]);
    // console.log('HAS PERMISSION', userHasPermission);

    return userHasPermission;
  }

  // Verifica se existe ao menos uma permissão verdadeira
  checkAtLeastOnePermission(permission, type: string){
    const permissions = this.getPermissions()
    const arrPermissions = Object.keys(permissions)

    let condition:any = arrPermissions.filter((key:any)=>key.startsWith(permission));
    return condition = condition.some((item:any)=>{
      if (this.checkPermission(item, type)) {
        return true;
      }
      return false;
    });
  }

  // Mostra modal de não autorização para acesso do módulo
  showUnauthorizedModal(message:any, route?: any){
    if (route !== undefined) {
      this.router.navigate([route]);
    }
    this.platModalService.toggle('message', message, 'close');
  }

  // Transforma objeto de edição de conceito de Disciplina em um observable para ser consumido
  get isConceptUpdated(){
    return this.editConcept$.asObservable();
  }

  capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  timeout: any = null;
  async debounce(searchText: string, timing?){

    if (!timing) {
        timing = 500
    }

    return new Promise((resolve)=>{
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        resolve(searchText);
      }, timing);
    })
  }

  isCookiesEnabled(){
		let cookieEnabled = navigator.cookieEnabled;
		if (!cookieEnabled){
			document.cookie = "testcookie";
			cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
		}
		return cookieEnabled;
	}

  isMobileOrLandscape(): boolean {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768; // Mobile width
    const isLandscapeMobile = isMobile && width > height;
    return isMobile || isLandscapeMobile;
  }

  fnReplaceDotForComa(value: number): string{
    const evaluation: string = value.toString()

    return evaluation.replace(".", ",");
  }

  generateRandomNumber(min?: number, max?: number): number {
    if (!min) {
      min = 20;
    }
    if (!max) {
      max = 85;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  showMessage(title: string, message: string, type: string): void {
    this.toastr.show(message, title, { progressBar: true}, type);
  }

  // Método para enviar o recurso para outras guias
  sendResource(resource: any) {
    this.resourceSubject.next(resource);
    console.log('send resource', resource);
  }

  // Método para receber o recurso atualizado
  getResource() {
    return this.resourceSubject.asObservable();
    console.log('get resource', this.resourceSubject);
  }

    deepClone(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        const clonedObj = Object.create(Object.getPrototypeOf(obj));

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }

        return clonedObj;
    }

    checkIfApiKeyExists(){
        const provider = localStorage.getItem('provider') || null;
        if (
            !localStorage.getItem('apiKey')
            && provider !== null
            && provider === 'GOOGLE_DRIVE'
        ) {
            this.logOut();
        }
    }

    insertHTMLFromString(str: string, id?: string ) {
        const div = document.createElement('div');
       
        div.innerHTML = str.trim();
        for(const child of div.children){
            const item = document.createElement(child.nodeName.toString());
            if (id) {
                item.id = id;
            }
            for(const attr of child.attributes){
                item[attr.name] = attr.value;
            }
            child.childNodes.forEach((tmp) => {
                item.appendChild(tmp);
            })
            document.head.appendChild(item);
        }
    }

    checkIfScriptsExists(id:string):boolean {
        const script = document.getElementById(id);
        if (script) {
            return true;
        }

        return false;
    }
}
