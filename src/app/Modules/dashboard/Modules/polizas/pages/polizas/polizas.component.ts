import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'polizas',
  styleUrls: ['./polizas.component.css'],
  templateUrl : './polizas.component.html',
})
export class PolizasComponent {

  constructor( private location : Location){

  }

  onBackBtn( ) {
    this.location.back();
  }

}
