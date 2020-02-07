import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Option} from '../option';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  private playerName;
  private score = 0;

  private nation;
  private leftText;
  private rightText;
  private result;

  private leftButton;
  private rightButton;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.playerName = this.route.snapshot.queryParams['player'];
    if (this.playerName == null) {
      this.router.navigateByUrl('');
    }

    this.leftButton = document.getElementById('leftButton');
    this.rightButton = document.getElementById('rightButton');

    this.loadNew();
  }

  clickedLeft() {
    if (this.result === 'left') {
      this.score++;
    } else {
      this.score--;
    }
    this.showCorrect();
  }

  clickedRight() {
    if (this.result === 'right') {
      this.score++;
    } else {
      this.score--;
    }
    this.showCorrect();
  }

  loadNew() {
    // option = getOption();

    const option = new Option('Česko', 'Čech', 'Českáč');

    this.nation = option.nation;

    this.setBtnColor(this.leftButton, 'primary');
    this.setBtnColor(this.rightButton, 'warning');

    if (Math.floor(Math.random() * 2) === 0) {
      this.leftText = option.correct;
      this.rightText = option.wrong;
      this.result = 'left';
    } else {
      this.leftText = option.wrong;
      this.rightText = option.correct;
      this.result = 'right';
    }

    this.leftButton.disabled = false;
    this.rightButton.disabled = false;
  }

  async showCorrect() {
    // Do something before delay
    this.leftButton.disabled = true;
    this.rightButton.disabled = true;
    if (this.result === 'left') {
      this.setBtnColor(this.leftButton, 'success');
      this.setBtnColor(this.rightButton, 'danger');
    } else {
      this.setBtnColor(this.leftButton, 'danger');
      this.setBtnColor(this.rightButton, 'success');
    }

    await this.delay(1500);

    // Do something after
    this.loadNew();
  }

  setBtnColor(e, color) {
    e.className = 'btn btn-' + color;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
