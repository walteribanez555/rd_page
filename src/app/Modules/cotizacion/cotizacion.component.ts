import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardAgeComponent } from './components/card-age/card-age.component';
import { FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CotizacionComponent {
  initialDate = new FormControl(null, Validators.required);
  finalDate = new FormControl(null, Validators.required);
  locationInput = new FormControl(null, Validators.required);
  originInput = new FormControl(null, Validators.required);

  initialAge = new FormControl(0);
  adultAge = new FormControl(0);
  seniorAge = new FormControl(0);

  onSelectInitialDate(event: any) {
    this.initialDate.setValue(event);
  }

  onSelectFinalDate(event: any) {
    this.finalDate.setValue(event);
  }

  onSelectDestiny(event: any) {
    this.locationInput.setValue(event.iso2);
  }


  onSelectOrigin(event : any){
    this.originInput.setValue(event.iso2);
  }

  private router = inject(Router);

  onQuote() {
    console.log({
      intialDate: this.initialDate.value,
      finalDate: this.finalDate.value,
      destiny: this.locationInput.value,
      adultAge: this.adultAge.value,
      initialAge: this.initialAge.value,
      seniorAge: this.seniorAge.value,
    });

    const initialDate = this.initialDate.value;
    const finalDate = this.finalDate.value;
    const origin = this.originInput.value;
    const destiny = this.locationInput.value;
    const adultAge = this.adultAge.value;
    const initialAge = this.initialAge.value;
    const seniorAge = this.seniorAge.value;

    if ((initialAge! > 0 || adultAge! > 0) && seniorAge! > 0) {
      window.alert('Los grupos de mayores de 70 se cotizan por separado');
      return;
    }

    if (!initialDate) {
      window.alert('La fecha inicial es requerida');
      return;
    }

    if (!finalDate) {
      window.alert('La fecha final es requerida');
      return;
    }

    if(!origin){
      window.alert('El Origen es requerido');
      return;
    }

    if (!destiny) {
      window.alert('El destino es requerido');
      return;
    }

    const repeatedArray = [];
    for (let i = 0; i < initialAge!; i++) {
      repeatedArray.push(1);
    }

    for (let i = 0; i < adultAge!; i++) {
      repeatedArray.push(21);
    }

    for (let i = 0; i < seniorAge!; i++) {
      repeatedArray.push(71);
    }

    var passengerCount = repeatedArray.length;

    var url = '../cotizar?';
    url +=
      'cantidad=' +
      passengerCount +
      '&edades=' +
      repeatedArray.join(',') +
      '&origen=' +
      origin +
      '&destino=' +
      destiny;
    url += '&tipo=FULL&fecha_ini=' + initialDate + '&fecha_fin=' + finalDate;

    const queryParams: NavigationExtras = {
      queryParams: {
        cantidad: passengerCount,
        edades: repeatedArray.join(','),
        origen: origin,
        destino: destiny,
        tipo: 'FULL',
        fecha_ini: initialDate,
        fecha_fin: finalDate,
      },
    };

    this.router.navigate(['cotizar'], queryParams);
  }
}
