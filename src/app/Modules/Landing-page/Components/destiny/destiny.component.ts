import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'destiny',
  // template: `<p>destiny works!</p>`,
  templateUrl : './destiny.component.html',
  styleUrls: ['./destiny.component.css'],
})
export class DestinyComponent {

  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();


  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }



 }
