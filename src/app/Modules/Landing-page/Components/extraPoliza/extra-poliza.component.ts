import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'extra-poliza',
  styleUrls: ['./extra-poliza.component.css'],
  templateUrl : './extra-poliza.component.html',
})
export class ExtraPolizaComponent {


  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();



  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }



}
