import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire'
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { PlayComponent } from './play/play.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule } from '@angular/forms';
import { CreateNationComponent } from './nations/create-nation/create-nation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgCircleProgressModule } from 'ng-circle-progress';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
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
