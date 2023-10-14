import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { Player } from '../players/player';
import { PlayerService } from '../players/player.service';
import { NationService } from '../nations/nation.service';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Nation } from '../nations/nation';

const DELAY = 1500;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})

export class PlayComponent implements OnInit, OnDestroy {
  faInfoCircle = faInfoCircle;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faHeart = faHeart;
  faVolumeUp = faVolumeUp;
  faVolumeMute = faVolumeMute;

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

  private showPercent = false;

  private timerPercent = 0;

  private interval;

  private backgroundMusic;
  private successSound;
  private failSound;
  private audioOn = false;

  nationsRef: AngularFireList<Nation> = null;

  private formatSubtitle = (percent: number): number => {
    if (percent >= 100) {
      return 0;
    } else if (percent >= 80) {
      return 1;
    } else if (percent >= 60) {
      return 2;
    } else if (percent >= 40) {
      return 3;
    } else if (percent >= 20) {
      return 4;
    } else {
      return 5;
    }
  };

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private router: Router,
              private playerService: PlayerService, private nationService: NationService, private db: AngularFireDatabase) {
    this.nationsRef = db.list('/nations');
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

    this.initSounds();

    this.initializeGame();
  }

  private initSounds() {
    this.successSound = new Audio();
    this.successSound.src = 'assets/audio/success_sound.wav';
    this.successSound.muted = true;
    this.successSound.load();

    this.failSound = new Audio();
    this.failSound.src = 'assets/audio/fail_sound.wav';
    this.failSound.muted = true;
    this.failSound.load();

    this.backgroundMusic = new Audio();
    this.backgroundMusic.src = 'assets/audio/background_music.wav';
    this.backgroundMusic.loop = true;
    this.backgroundMusic.muted = true;
    this.backgroundMusic.load();
  }

  initializeGame() {
    this.nationsRef.query.orderByChild('index').limitToLast(1).once('value').then(snapshot => {
      const lastNation = snapshot.child(Object.keys(snapshot.val())[0]).val();
      this.numberOfNations = lastNation.index;
      this.backgroundMusic.play();
      this.loadNew();
    });
  }

  private wrong() {
    this.loseLife();
    this.updateWrong();
  }

  private correct() {
    this.player.score++;
    this.successSound.play();
    this.updateCorrect();
  }

  clickedLeft() {
    if (this.result === 'left') {
      this.correct();
    } else {
      this.wrong();
    }
    this.showCorrect();
  }

  clickedRight() {
    if (this.result === 'right') {
      this.correct();
    } else {
      this.wrong();
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
    this.timerPercent = 0;

    // Reset colors
    this.setBtnColor(this.leftButton, 'primary');
    this.setBtnColor(this.rightButton, 'warning');

    const startIndex = Math.ceil(Math.random() * this.numberOfNations);

    this.nationsRef.query.orderByChild('index').startAt(startIndex).limitToFirst(1).once('value').then(snapshot => {
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

      this.interval = setInterval(() => {
          this.timerPercent++;
          if (this.timerPercent == 100) {
            this.loseLife();
            this.showCorrect();
          }
        }
        , 50);
      this.loaded = true;
      this.showPercent = false;
    });
  }

  async showCorrect() {
    clearInterval(this.interval);

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

    if (this.player.lives == 0) {
      this.endGame();
      return;
    }
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

  loseLife() {
    this.player.lives--;
    this.failSound.play();
  }

  endGame() {
    this.saveScore();
    this.router.navigate(['/leaderboard'], {queryParams: {volume: this.audioOn}});
  }

  toggleAudio() {
    this.audioOn = !this.audioOn;
    this.backgroundMusic.muted = !this.backgroundMusic.muted;
    this.successSound.muted = !this.successSound.muted;
    this.failSound.muted = !this.failSound.muted;
  }

  ngOnDestroy(): void {
    this.backgroundMusic.pause();
    this.successSound.pause();
    this.failSound.pause();
    clearInterval(this.interval);
  }
}
