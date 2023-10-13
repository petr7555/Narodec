// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: "AIzaSyC9_TSP9JQQ4PDBIBnR8O_XB79qvT0Tocs",
  authDomain: "narodec-64814.firebaseapp.com",
  projectId: "narodec-64814",
  storageBucket: "narodec-64814.appspot.com",
  messagingSenderId: "323728121178",
  appId: "1:323728121178:web:f5d05250f83cc00f852763"
};

export const environment = {
  production: true,
  firebase : firebaseConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
