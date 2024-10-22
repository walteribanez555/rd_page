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
import { CountryRegionLng, Translations } from '../../utils/data/countries-region.ts/country-region-lng';
import { countrys } from '../../utils/data/countries-lng';
import { filtrarPaises, obtenerNombreTraducido } from '../../utils/filters/country-filter';

@Component({
  selector: 'select-custom',
  templateUrl: './selectCustom.component.html',
  styleUrls: ['./selectCustom.component.css'],
})
export class SelectCustomComponent implements OnInit {
  ngOnInit(): void {
    this.filteredCountries = this.countries;

    if(this.initialValueItem) {
      this.updateActualName(this.initialValueItem);
    }
  }

  isToggle: boolean = false;
  searchInput: string = 'Select Country';

  searchText: string = '';

  @Input() initialValueItem : CountryRegionLng | null = null;

  updateToggle() {
    if( this.initialValueItem ) return;
    this.isToggle = !this.isToggle;
  }

  filteredCountries: CountryRegionLng[] = [];

  updateActualName(selectedCountry: CountryRegionLng) {


    this.searchInput = this.getCountryByIso2(selectedCountry.iso2)!;
    this.isToggle = false;
    this.onselectDestiny.emit(selectedCountry);
  }

  filterBySearch() {
    const lang: keyof Translations | null = localStorage.getItem('lang') as keyof Translations | null;

    const codigosIdioma: Record<keyof Translations, boolean> = {
      kr: true,
      'pt-BR': true,
      pt: true,
      nl: true,
      hr: true,
      fa: true,
      de: true,
      es: true,
      fr: true,
      ja: true,
      it: true,
      cn: true,
      tr: true,
    };



    // if (!(lang! in codigosIdioma)) {
    //   // Maneja el caso en el que el código de idioma no es válido
    //   console.error('Código de idioma no válido');
    //   return; // O maneja el error de alguna otra manera
    // }





    const paisesFiltrados = filtrarPaises(this.countries, lang!, this.searchText.toLowerCase());
    this.filteredCountries = paisesFiltrados;
    // console.log(paisesFiltrados);
  }

  getCountryByIso2( codeIso2 : string) {

    const lang: keyof Translations | null = localStorage.getItem('lang') as keyof Translations | null;

    const codigosIdioma: Record<keyof Translations, boolean> = {
      kr: true,
      'pt-BR': true,
      pt: true,
      nl: true,
      hr: true,
      fa: true,
      de: true,
      es: true,
      fr: true,
      ja: true,
      it: true,
      cn: true,
      tr: true,
    };



    // if (!(lang! in codigosIdioma)) {
    //   // Maneja el caso en el que el código de idioma no es válido
    //   console.error('Código de idioma no válido');
    //   return; // O maneja el error de alguna otra manera
    // }



    const country = this.countries.filter( country => country.iso2 == codeIso2)[0];


    return obtenerNombreTraducido(country, lang!);
  }

  // filterBySearch() {
  //   this.filteredCountries = this.countries.filter((country) =>
  //     country.country.toLowerCase().startsWith(this.searchText.toLowerCase())
  //   );
  // }

  @Output() onselectDestiny = new EventEmitter<CountryRegionLng>();


  countries : CountryRegionLng[] = countrys;

  // countries: string[] = [
  //   'America del sur',
  //   'America del norte',
  //   'Centro America',
  //   'Europa',
  //   'Asia',
  //   'Oceania',
  //   'Afganistán',
  //   'Albania',
  //   'Alemania',
  //   'Andorra',
  //   'Angola',
  //   'Antigua y Barbuda',
  //   'Arabia Saudita',
  //   'Argelia',
  //   'Argentina',
  //   'Armenia',
  //   'Australia',
  //   'Austria',
  //   'Azerbaiyán',
  //   'Bahamas',
  //   'Bangladés',
  //   'Barbados',
  //   'Baréin',
  //   'Bélgica',
  //   'Belice',
  //   'Benín',
  //   'Bielorrusia',
  //   'Birmania',
  //   'Bolivia',
  //   'Bosnia y Herzegovina',
  //   'Botsuana',
  //   'Brasil',
  //   'Brunéi',
  //   'Bulgaria',
  //   'Burkina Faso',
  //   'Burundi',
  //   'Bután',
  //   'Cabo Verde',
  //   'Camboya',
  //   'Camerún',
  //   'Canada',
  //   'Catar',
  //   'Chad',
  //   'Chile',
  //   'China',
  //   'Chipre',
  //   'Ciudad del Vaticano',
  //   'Colombia',
  //   'Comoras',
  //   'Corea del Norte',
  //   'Corea del Sur',
  //   'Costa de Marfil',
  //   'Costa Rica',
  //   'Croacia',
  //   'Cuba',
  //   'Dinamarca',
  //   'Dominica',
  //   'Ecuador',
  //   'Egipto',
  //   'El Salvador',
  //   'Emiratos Árabes Unidos',
  //   'Eritrea',
  //   'Eslovaquia',
  //   'Eslovenia',
  //   'España',
  //   'Estados Unidos',
  //   'Estonia',
  //   'Etiopía',
  //   'Filipinas',
  //   'Finlandia',
  //   'Fiyi',
  //   'Francia',
  //   'Gabón',
  //   'Gambia',
  //   'Georgia',
  //   'Ghana',
  //   'Granada',
  //   'Grecia',
  //   'Guatemala',
  //   'Guyana',
  //   'Guinea',
  //   'Guinea ecuatorial',
  //   'Guinea-Bisáu',
  //   'Haití',
  //   'Honduras',
  //   'Hungría',
  //   'India',
  //   'Indonesia',
  //   'Irak',
  //   'Irán',
  //   'Irlanda',
  //   'Islandia',
  //   'Islas Marshall',
  //   'Islas Salomón',
  //   'Israel',
  //   'Italia',
  //   'Jamaica',
  //   'Japón',
  //   'Jordania',
  //   'Kazajistán',
  //   'Kenia',
  //   'Kirguistán',
  //   'Kiribati',
  //   'Kuwait',
  //   'Laos',
  //   'Lesoto',
  //   'Letonia',
  //   'Líbano',
  //   'Liberia',
  //   'Libia',
  //   'Liechtenstein',
  //   'Lituania',
  //   'Luxemburgo',
  //   'Macedonia del Norte',
  //   'Madagascar',
  //   'Malasia',
  //   'Malaui',
  //   'Maldivas',
  //   'Malí',
  //   'Malta',
  //   'Marruecos',
  //   'Mauricio',
  //   'Mauritania',
  //   'México',
  //   'Micronesia',
  //   'Moldavia',
  //   'Mónaco',
  //   'Mongolia',
  //   'Montenegro',
  //   'Mozambique',
  //   'Namibia',
  //   'Nauru',
  //   'Nepal',
  //   'Nicaragua',
  //   'Níger',
  //   'Nigeria',
  //   'Noruega',
  //   'Nueva Zelanda',
  //   'Omán',
  //   'Países Bajos',
  //   'Pakistán',
  //   'Palaos',
  //   'Panamá',
  //   'Papúa Nueva Guinea',
  //   'Paraguay',
  //   'Perú',
  //   'Polonia',
  //   'Portugal',
  //   'Qatar',
  //   'Reino Unido',
  //   'República Centroafricana',
  //   'República Checa',
  //   'República del Congo',
  //   'República Democrática del Congo',
  //   'República Dominicana',
  //   'Ruanda',
  //   'Rumanía',
  //   'Rusia',
  //   'Samoa',
  //   'San Cristóbal y Nieves',
  //   'San Marino',
  //   'San Vicente y las Granadinas',
  //   'Santa Lucía',
  //   'Santo Tomé y Príncipe',
  //   'Senegal',
  //   'Serbia',
  //   'Seychelles',
  //   'Sierra Leona',
  //   'Singapur',
  //   'Siria',
  //   'Somalia',
  //   'Sri Lanka',
  //   'Suazilandia',
  //   'Sudáfrica',
  //   'Sudán',
  //   'Sudán del Sur',
  //   'Suecia',
  //   'Suiza',
  //   'Surinam',
  //   'Tailandia',
  //   'Tanzania',
  //   'Tayikistán',
  //   'Timor Oriental',
  //   'Togo',
  //   'Tonga',
  //   'Trinidad y Tobago',
  //   'Túnez',
  //   'Turkmenistán',
  //   'Turquía',
  //   'Tuvalu',
  //   'Ucrania',
  //   'Uganda',
  //   'Uruguay',
  //   'Uzbekistán',
  //   'Vanuatu',
  //   'Venezuela',
  //   'Vietnam',
  //   'Yemen',
  //   'Yibuti',
  //   'Zambia',
  //   'Zimbabue',
  // ];

  //   updateName(selectedLi) {
  //     searchInp.value = "";
  //     addCountry(selectedLi.innerText);
  //     wrapper.classList.remove("active");
  //     selectBtn.firstElementChild.innerText = selectedLi.innerText;
  // }
}
