import { Component, OnInit } from '@angular/core';
import { AllowIn, ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  private player = '';

  shortcuts: ShortcutInput[] = [];

  constructor() {
  }

  ngOnInit() {
    this.shortcuts.push(
      {
        key: ['enter'],
        description: 'Enter',
        allowIn: [AllowIn.Input],
        command: e => {
          document.getElementById('signin-button').click();
        },
        preventDefault: true
      }
    );
  }

}
