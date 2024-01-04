import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfService {

  constructor() { }


  generatePdfFromCanvas(...canvases: HTMLCanvasElement[]) {
    const doc = new jsPDF('p', 'pt', 'a4');

    canvases.forEach((canva, index) => {
      if (index > 0) {
        doc.addPage();
      }
      const img = canva.toDataURL('image/png');
      const bufferX = 0;
      const bufferY = 0;
      const imgProps = doc.getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    });

    doc.save(`redcard_policie.pdf`);
  }

  generatePdfAsync(...canvases: HTMLCanvasElement[]): Observable<void> {
    return new Observable<void>(observer => {
      try {
        this.generatePdfFromCanvas(...canvases);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}
