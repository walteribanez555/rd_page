import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { locationTravel } from './locationTravel';
import { FormGroup } from '@angular/forms';
import { CountryRegion } from 'src/app/Modules/shared/utils/data/countries-region.ts/countries-region';
import { CountryRegionLng } from 'src/app/Modules/shared/utils/data/countries-region.ts/country-region-lng';
import { states_city } from 'src/app/Modules/shared/utils/data/states';
import { countrys } from 'src/app/Modules/shared/utils/data/countries-lng';

@Component({
  selector: 'dates-to-travel',
  // template: `<p>datesToTravel works!</p>`,
  templateUrl : 'datesToTravel.component.html',
  styleUrls: ['./datesToTravel.component.css'],
})
export class DatesToTravelComponent implements OnInit {

  initialValueItem  : CountryRegionLng | null = null;


  ngOnInit(): void {

    const value = this.places.get('toLocation')?.value;
    const origin = this.places.get('fromLocation')?.value;



    if(value && origin){
      this.onSelectedDestiny(value[0]);
      this.onSelectedOrigen(origin[0]);
    }

    if( origin ){
      this.initialValueItem = origin;
    }

  }

  @Output() onChangePage = new EventEmitter();


  locations : locationTravel[] = [

  ];

  @Input() places! : FormGroup;


  tags : String[] = [];


  changeLocation(positionSelected : number) {

    this.locations.splice(positionSelected, 1);
    this.places.get('toLocation')?.setValue(this.locations.map(location => location.location));

  }


  onChangeStep() {

    this.onChangePage.emit();
  }

  onSelectedDestiny( destiny : CountryRegionLng) {


    this.locations.push({
      location : destiny,
      isSelected : true,
    })

    this.places.get('toLocation')?.setValue(this.locations.map(location => location.location));

  }

  onSelectedOrigen( place : CountryRegionLng) {
    this.places.get('fromLocation')?.setValue(place);
  }


}
