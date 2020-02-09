import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Nation} from './nation';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NationService {

  private dbPath = '/nations';
  numberOfNations;

  nationsRef: AngularFireList<Nation> = null;

  constructor(private db: AngularFireDatabase) {
    this.nationsRef = db.list(this.dbPath);
    this.setNumberOfNations();
  }

  setNumberOfNations() {
    firebase.database().ref(this.dbPath).orderByChild('index').limitToLast(1).once('value').then(snapshot => {
      if (snapshot.val() != null) {
        const lastNation = snapshot.child(Object.keys(snapshot.val())[0]).val();
        this.numberOfNations = lastNation.index;
      } else {
        this.numberOfNations = 0;
      }
    });
  }

  getNumberOfNations() {
    return this.numberOfNations;
  }

  createNation(nation: Nation): void {
    this.numberOfNations++;
    nation.index = this.numberOfNations;
    this.nationsRef.push(nation);
  }

  updateNation(key: string, value: any): Promise<void> {
    return this.nationsRef.update(key, value);
  }

  getNationsList(): AngularFireList<Nation> {
    return this.nationsRef;
  }

}
