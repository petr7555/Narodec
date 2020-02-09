import {Injectable} from '@angular/core';
import {Nation} from '../nations/nation';
import {Player} from './player';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private dbPath = '/players';

  playersRef: AngularFireList<Player> = null;

  constructor(private db: AngularFireDatabase) {
    this.playersRef = db.list(this.dbPath);
  }

  createPlayer(player: Player): void {
    this.playersRef.push(player);
  }
}
