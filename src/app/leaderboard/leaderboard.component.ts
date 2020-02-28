import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  topPlayers: any[];
  private showGameOverScreen = true;

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getTopPlayers();
    if (this.route.snapshot.queryParams['volume'] == 'true') {
      let gameOverSound = new Audio();
      gameOverSound.src = 'assets/audio/game_over_sound.wav';
      gameOverSound.volume = 0.5;
      gameOverSound.load();
      gameOverSound.play();
    }

    setTimeout(() => {
        this.showGameOverScreen = false;
      },
      2000);
  }

  getTopPlayers() {
    this.db.list('/players', ref => ref.orderByChild('score').limitToLast(10)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({key: c.payload.key, ...c.payload.val()})
        )
      )
    ).subscribe(topPlayers => {
      this.topPlayers = topPlayers.reverse();
    });
  }
}
