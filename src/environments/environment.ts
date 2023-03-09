// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serviceUrl:
    'http://flexbi-xeroapi.australiaeast.cloudapp.azure.com/backend/',
    // 'http://localhost:3000/',
  gcmToken:
    'dvs8NCiGdu14Lv7Mcnff70:APA91bHStrZrda4A2c4MFZdwT2UVjP--cq1xlD9rUVzuN6DPFZw4Ai2Qju1QdTePn4uKGXGZTqZFbE3nPw4dFUA7LPDkMgpHMuqc3VGTqrWEIJitSPPCPKEbz-Npk8qIS5_lr_CL9nw3',
  // googleClientId:
  //   '755158558855-94o61uq742fo63pqqee8dmpou9a9nej5.apps.googleusercontent.com',
  // microsoft: {
  //   clientId: 'b0f88104-4f4b-4a83-acea-7e2d1df5bb42',
  //   redirectURL: 'https://flexbireport.com.au/',
  // },
  // captchaKey: '6LenPE8cAAAAALKpEI7INq7dq_I68TZwnK806Hz0',
  isValidateCaptch: false,
  deployUrl: 'http://localhost:4200',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
