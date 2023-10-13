import { Component, OnInit } from '@angular/core';
import { NationService } from '../nation.service';
import { Nation } from '../nation';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-nation.component.html',
  styleUrls: ['./create-nation.component.scss']
})
export class CreateNationComponent implements OnInit {

  nation: Nation = new Nation();
  submitted = false;

  constructor(private nationService: NationService) { }

  ngOnInit() {
  }

  newNation(): void {
    this.submitted = false;
    this.nation = new Nation();
  }

  save() {
    this.nationService.createNation(this.nation);
    this.nation = new Nation();
  }

  onSubmit() {
    this.submitted = true;
    this.save();
  }
}
