import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { ServicioUi } from '../../../models/Servicio.ui';
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

    this.qrCode = `http://192.168.0.13:4200/landing-page/confirm-poliza/${this.poliza?.poliza_id}`
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




}
