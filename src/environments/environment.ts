// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyCUSFVY0eOKtupC0Wxpi832ZbYfnMVcP04',
        authDomain: 'plat-v2-dev-notification.firebaseapp.com',
        projectId: 'plat-v2-dev-notification',
        storageBucket: 'plat-v2-dev-notification.appspot.com',
        messagingSenderId: '615792906319',
        appId: '1:615792906319:web:bbe05e8388e84f28d69a3a',
        measurementId: 'G-2JRELD4C0H',
        vapidKey: 'BOM9tSmHIqrnJq2WuP04laFSg2ZLv3T_doPqmd-0pnYy9H8of1HNfRq9miGkr_Bb75H3ipQR8_x7vOkpn5zMGYM'
    },
};

export const API_Routes = {
    URL: '/api',
    DOMAIN: 'localhost',
};

export const App_settings = {
    VERSION: require('../../package.json').version,
    PROJECT_ID: 'inicie-plataforma-dev',
    API_KEY: 'AIzaSyBge6aDNLox3cfCZZ6AzfQwImJtNTcWHvE'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
