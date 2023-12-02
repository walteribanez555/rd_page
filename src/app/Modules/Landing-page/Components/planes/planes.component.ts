import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ServicioUi } from 'src/app/Modules/shared/models';

@Component({
  selector: 'planes',
  templateUrl : './planes.component.html',
  styleUrls: ['./planes.component.css'],
})
export class PlanesComponent {
  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();

  @Input() serviciosUi : ServicioUi[] | null = null;


  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }
}
