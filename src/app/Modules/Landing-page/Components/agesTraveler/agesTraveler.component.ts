import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ages-traveler',
  templateUrl : './agesTraveler.component.html',
  styleUrls: ['./agesTraveler.component.css'],
})
export class AgesTravelerComponent {

  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();


  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }



 }
