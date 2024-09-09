import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { ServicioUi } from '../../../models/Servicio.ui';
import { countrys } from '../../../utils/data/countries-lng';
import { Translations } from '../../../utils/data/countries-region.ts/country-region-lng';
import { obtenerNombreTraducido } from '../../../utils/filters/country-filter';
import { Beneficiario, Poliza, Venta } from 'src/app/Modules/Core/models';




@Component({
  selector: 'poliza-pdf',
  templateUrl: './poliza-pdf.component.html',
  styleUrls: ['./poliza-pdf.component.css']
})
export class PolizaPdfComponent  implements OnInit {
  ngOnInit(): void {

    console.log(this.poliza);
    console.log(this.beneficiario);
    console.log(this.servicioUi);



    this.qrCode = `https://redcardassist.com.bo/confirm?polizas=${this.poliza?.poliza_id?? this.poliza?.id!}`
  }
  qrCode = "Holamundo";


  @Input() beneficiario? : Beneficiario;
  @Input() servicioUi? : ServicioUi;
  @Input() poliza? : Poliza;
  @Input() venta? : Venta;
  actualDate = new Date().toDateString();


  @Output()  isLoaded = new EventEmitter<number>()


  onLoadedQr(event :any ){
    this.isLoaded.emit(1);

  }




  getDestinyByIso2(iso2 : string){
    if(iso2.length > 2) {
      return iso2;
    }


    const country= countrys.filter( country =>  country.iso2 === iso2 )[0];

    const lang: keyof Translations | null = localStorage.getItem('lang') as keyof Translations | 'es';

    return obtenerNombreTraducido(country, lang!);

  }

  isWithEuros( iso2 : string) {
    if(iso2.toLocaleLowerCase().startsWith('eur')){
      return true;
    }


    const country = countrys.filter( country => country.iso2.toLocaleLowerCase() === iso2.toLocaleLowerCase() )[0];

    if ( country.region.toLocaleLowerCase().startsWith('eur')){
      return true;
    }

    return false;

    // Europe



  }



}
