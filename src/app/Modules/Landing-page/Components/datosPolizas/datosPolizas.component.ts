import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'datos-polizas',
  templateUrl : './datosPolizas.component.html',
  styleUrls: ['./datosPolizas.component.css'],
})
export class DatosPolizasComponent {

  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();


  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }

}
