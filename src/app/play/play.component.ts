import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';

import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ShortcutInput} from 'ng-keyboard-shortcuts';
import {Player} from '../players/player';
import {PlayerService} from '../players/player.service';
import {NationService} from '../nations/nation.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';

const DELAY = 1500;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit {
  faInfoCircle = faInfoCircle;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  modalOptions: NgbModalOptions;
  private player: Player = new Player();

  shortcuts: ShortcutInput[] = [];

  private nationKey;
  private country;
  private leftText;
  private rightText;
  private result;
  private numOfCorrect;
  private numOfWrong;
  private percentLeft;
  private percentRight;

  private leftButton;
  private rightButton;

  private loaded = false;
  private numberOfNations;
  private ref;

  private showPercent = false;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private playerService: PlayerService, private nationService: NationService) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    };
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
    }, (reason) => {
    });
  }


  ngOnInit() {
    this.player.name = this.route.snapshot.queryParams['player'];
    if (this.player.name == null) {
      this.router.navigateByUrl('');
    }

    this.leftButton = document.getElementById('leftButton');
    this.rightButton = document.getElementById('rightButton');

    this.shortcuts.push(
      {
        key: ['left'],
        description: 'Left arrow',
        command: e => {
          this.clickedLeft();
        },
        preventDefault: true
      },
      {
        key: ['right'],
        description: 'Right arrow',
        command: e => {
          this.clickedRight();
        },
        preventDefault: true
      }
    );

    this.ref = firebase.database().ref('/nations');

    this.initializeGame();
  }

  initializeGame() {
    this.ref.orderByChild('index').limitToLast(1).once('value').then(snapshot => {
      const lastNation = snapshot.child(Object.keys(snapshot.val())[0]).val();
      this.numberOfNations = lastNation.index;
      this.loadNew();
    });
  }

  clickedLeft() {
    if (this.result === 'left') {
      this.player.score++;
      this.updateCorrect();
    } else {
      this.player.score--;
      this.updateWrong();
    }
    this.showCorrect();
  }

  clickedRight() {
    if (this.result === 'right') {
      this.player.score++;
      this.updateCorrect();
    } else {
      //update number of wrong
      this.player.score--;
      this.updateWrong();
    }
    this.showCorrect();
  }

  updateCorrect() {
    this.numOfCorrect++;
    this.nationService.updateNation(this.nationKey, {numOfCorrect: this.numOfCorrect})
      .catch(err => console.log(err));
  }

  updateWrong() {
    this.numOfWrong++;
    this.nationService.updateNation(this.nationKey, {numOfWrong: this.numOfWrong})
      .catch(err => console.log(err));
  }

  loadNew() {
    // Reset colors
    this.setBtnColor(this.leftButton, 'primary');
    this.setBtnColor(this.rightButton, 'warning');

    const startIndex = Math.ceil(Math.random() * this.numberOfNations);

    this.ref.orderByChild('index').startAt(startIndex).limitToFirst(1).once('value').then(snapshot => {
      this.nationKey = Object.keys(snapshot.val())[0];

      const nation = snapshot.child(this.nationKey).val();

      //set country
      this.country = nation.country;

      // Randomly choose where the correct answer will be
      if (Math.round(Math.random()) === 0) {
        this.leftText = nation.correct;
        this.rightText = nation.wrong;
        this.result = 'left';
      } else {
        this.leftText = nation.wrong;
        this.rightText = nation.correct;
        this.result = 'right';
      }

      this.numOfCorrect = nation.numOfCorrect;
      this.numOfWrong = nation.numOfWrong;

      // Enable clicking on buttons
      this.leftButton.disabled = false;
      this.rightButton.disabled = false;

      this.loaded = true;
      this.showPercent = false;
    });
  }

  async showCorrect() {

    // Disable clicking
    this.leftButton.disabled = true;
    this.rightButton.disabled = true;

    const total = this.numOfWrong + this.numOfCorrect;
    // two decimal places
    const correct = Math.round(this.numOfCorrect / total * 100 * 100) / 100;
    const wrong = Math.round(this.numOfWrong / total * 100 * 100) / 100;

    // Change color according to correct answer
    if (this.result === 'left') {
      this.percentLeft = correct;
      this.percentRight = wrong;
      this.setBtnColor(this.leftButton, 'success');
      this.setBtnColor(this.rightButton, 'danger');
    } else {
      this.percentLeft = wrong;
      this.percentRight = correct;
      this.setBtnColor(this.leftButton, 'danger');
      this.setBtnColor(this.rightButton, 'success');
    }

    this.showPercent = true;
    await this.delay(DELAY);

    // Load next question
    this.loadNew();
  }

  setBtnColor(e, color) {
    e.className = 'btn btn-' + color;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  saveScore() {
    this.playerService.createPlayer(this.player);
  }
}
