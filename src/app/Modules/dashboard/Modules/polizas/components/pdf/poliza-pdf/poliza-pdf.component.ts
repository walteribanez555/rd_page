import { Component, ElementRef, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { GeneratePdfService } from './services/generate-pdf.service';
import html2canvas from 'html2canvas';




@Component({
  selector: 'poliza-pdf',
  templateUrl: './poliza-pdf.component.html',
  styleUrls: ['./poliza-pdf.component.css']
})
export class PolizaPdfComponent {
  qrCode = "Holamundo";

  @Output()  isLoaded = new EventEmitter<number>()


  onLoadedQr(event :any ){
    this.isLoaded.emit(1);

  }




}
