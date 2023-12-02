import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { locationTravel } from './locationTravel';

@Component({
  selector: 'dates-to-travel',
  // template: `<p>datesToTravel works!</p>`,
  templateUrl : 'datesToTravel.component.html',
  styleUrls: ['./datesToTravel.component.css'],
})
export class DatesToTravelComponent {

  @Output() onChangePage = new EventEmitter();

  locations : locationTravel[] = [
    {
      location : "Europa",
      isSelected : false,
    },
    {
      location : "America Del Sur",
      isSelected : false,
    },
    {
      location : "America Del Norte",
      isSelected : false,
    },
    {
      location : "Centro America",
      isSelected : false,
    },
    {
      location : "Asia",
      isSelected : false,
    },
    {
      location : "Oceania",
      isSelected : false,
    },
    {
      location : "Multi Viajes",
      isSelected : false,
    },
  ];


  tags : String[] = [];


  changeLocation(positionSelected : number) {

    this.locations[positionSelected].isSelected = !this.locations[positionSelected].isSelected;

    console.log(this.locations[positionSelected]);
  }


  onChangeStep() {
    this.onChangePage.emit();
  }

}
