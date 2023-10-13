import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CreateNationComponent } from './nations/create-nation/create-nation.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

const routes: Routes = [
  {path: '', component: SignInComponent},
  {path: 'play', component: PlayComponent},
  {path: 'add', component: CreateNationComponent},
  {path: 'leaderboard', component: LeaderboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
