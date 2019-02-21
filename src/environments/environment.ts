// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  list: 'http://localhost:8080/api/codes',
  search: 'http://localhost:8080/api/textsearch',
  sub: 'http://localhost:8080/api/codes/achi/',
  map: 'http://localhost:8080/api/codes/map',
  unique_code: 'http://localhost:8080/api/codes/code',
  unique_achi: 'http://localhost:8080/api/codes/find/achi',
  add: 'http://localhost:8080/api/codes/add'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
