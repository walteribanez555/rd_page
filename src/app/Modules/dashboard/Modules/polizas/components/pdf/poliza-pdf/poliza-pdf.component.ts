import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { GeneratePdfService } from './services/generate-pdf.service';
import html2canvas from 'html2canvas';
import { Beneficiario, Poliza } from 'src/app/Modules/Core/models';
import { ServicioUi } from 'src/app/Modules/shared/models';




@Component({
  selector: 'poliza-pdf',
  templateUrl: './poliza-pdf.component.html',
  styleUrls: ['./poliza-pdf.component.css']
})
export class PolizaPdfComponent  implements OnInit {
  ngOnInit(): void {
    if (this.servicioUi && this.servicioUi.catalogos) {
      this.servicioUi.catalogos = this.servicioUi.catalogos
        .filter(c => c.beneficios && Array.isArray(c.beneficios)) // Filtering out elements where beneficios is null or not an array
        .sort((c1, c2) => {
          if (c1.beneficios && c2.beneficios) {
            return c1.beneficios.length - c2.beneficios.length;
          }
          return 0;
        });
    }
    console.log(this.servicioUi);

    this.qrCode = `http://192.168.0.13:4200/landing-page/confirm-poliza/${this.poliza?.poliza_id}`
  }
  qrCode = "Holamundo";


  @Input() beneficiario? : Beneficiario;
  @Input() servicioUi? : ServicioUi;
  @Input() poliza? : Poliza;
  actualDate = new Date().toDateString();


  @Output()  isLoaded = new EventEmitter<number>()


  onLoadedQr(event :any ){
    this.isLoaded.emit(1);

  }




}
