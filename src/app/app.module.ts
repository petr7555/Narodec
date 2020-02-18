import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireFunctionsModule} from '@angular/fire/functions';
import {PlayComponent} from './play/play.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {FormsModule} from '@angular/forms';
import {CreateNationComponent} from './nations/create-nation/create-nation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import * as firebase from 'firebase';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import {KeyboardShortcutsModule} from 'ng-keyboard-shortcuts';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgCircleProgressModule} from 'ng-circle-progress';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    SignInComponent,
    CreateNationComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'narodec'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    FormsModule,
    NgbModule,
    KeyboardShortcutsModule.forRoot(),
    FontAwesomeModule,
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
