import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Nation } from './nation';

@Injectable({
  providedIn: 'root'
})
export class NationService {
  numberOfNations: number;

  nationsRef: AngularFireList<Nation> = null;

  constructor(private db: AngularFireDatabase) {
    this.nationsRef = db.list('/nations');
    this.setNumberOfNations();
  }

  setNumberOfNations() {
    this.nationsRef.query.orderByChild('index').limitToLast(1).once('value').then(snapshot => {
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
