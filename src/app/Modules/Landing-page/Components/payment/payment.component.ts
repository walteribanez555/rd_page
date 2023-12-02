import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'payment',
  templateUrl : './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {

  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();


  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }


 }
