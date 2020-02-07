import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PlayComponent} from './play/play.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {DirectAccessGuard} from './DirectAccessGuard';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'play', component: PlayComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
