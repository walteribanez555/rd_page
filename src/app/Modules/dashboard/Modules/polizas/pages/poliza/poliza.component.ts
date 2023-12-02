import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'poliza',
  styleUrls: ['./poliza.component.css'],
  templateUrl: './poliza.component.html',
})
export class PolizaComponent {
  constructor(private location: Location) {}

  onBackBtn() {
    this.location.back();
  }
}
