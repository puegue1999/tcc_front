// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';

// if (environment.production) {
//     window.console.log = () => { };
//     enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch((err) => console.error(err));

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 
import { AppModule } from './app/app.module';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
 
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));