import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { locationTravel } from '../datesToTravel/locationTravel';

@Component({
  selector: 'location',
  template: `
  <div class="card" [class.selected]="location.isSelected"  (click)="changeLocation()">
    <i class="fa-solid fa-globe" [class.selected]="location.isSelected"></i>
    <span [class.selected]="location.isSelected" >{{location.location}}</span>
  </div>`,
  styleUrls: ['./location.component.css'],
})
export class LocationComponent {


  @Input() location! : locationTravel;

  @Input() position! : number;

  @Output() selectionChanged = new EventEmitter<number>();



  changeLocation() {
    !this.location.isSelected
    this.selectionChanged.emit(this.position);
  }



  // location : string = "Destino";



}
