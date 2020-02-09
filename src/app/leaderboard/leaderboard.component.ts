import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  topPlayers: any[];

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.getTopPlayers();
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
