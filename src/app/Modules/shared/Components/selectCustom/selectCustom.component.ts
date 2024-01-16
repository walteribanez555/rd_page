import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CountryRegion, countriesRegion } from '../../utils/data/countries-region.ts/countries-region';

@Component({
  selector: 'select-custom',
  templateUrl: './selectCustom.component.html',
  styleUrls: ['./selectCustom.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCustomComponent implements OnInit {
  ngOnInit(): void {
    this.filteredCountries = this.countries;
  }

  isToggle: boolean = false;
  searchInput: string = 'Select Country';

  searchText: string = '';

  updateToggle() {
    this.isToggle = !this.isToggle;
  }

  filteredCountries: CountryRegion[] = [];

  updateActualName(selectedCountry: CountryRegion) {
    this.searchInput = selectedCountry.country;
    this.isToggle = false;
    this.onselectDestiny.emit(selectedCountry);
  }

  filterBySearch() {
    this.filteredCountries = this.countries.filter((country) =>
      country.country.toLowerCase().startsWith(this.searchText.toLowerCase())
    );
  }

  @Output() onselectDestiny = new EventEmitter<CountryRegion>();


  countries : CountryRegion[] = countriesRegion;

  //   updateName(selectedLi) {
  //     searchInp.value = "";
  //     addCountry(selectedLi.innerText);
  //     wrapper.classList.remove("active");
  //     selectBtn.firstElementChild.innerText = selectedLi.innerText;
  // }
}
