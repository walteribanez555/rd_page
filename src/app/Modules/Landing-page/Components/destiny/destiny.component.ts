import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { DatesAction } from 'src/app/Modules/shared/utils/dates/dates-action';

@Component({
  selector: 'destiny',
  // template: `<p>destiny works!</p>`,
  templateUrl : './destiny.component.html',
  styleUrls: ['./destiny.component.css'],
})
export class DestinyComponent  implements OnInit {
  ngOnInit(): void {

    this.initialDate= this.datesForm.get('initialDate') as FormControl;
    this.finalDate = this.datesForm.get('finalDate') as FormControl;
    this.quantityDays = this.datesForm.get('quantityDays') as FormControl;


  }

  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();


  @Input() datesForm! : FormGroup;


  initialDate? : FormControl;
  finalDate? : FormControl;
  quantityDays? : FormControl;

  datesActions = new DatesAction();


  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }

  setInitialDate( date : string) {
    this.initialDate?.setValue(date);
    console.log(date);

    if(this.initialDate?.valid && this.finalDate?.valid){
      this.quantityDays?.setValue(this.datesActions.quantityBetweenDates(this.initialDate.value as string, this.finalDate.value as string));
    }

  }

  setFinalDate( date : string){
    this.finalDate?.setValue(date);
    if(this.initialDate?.valid && this.finalDate?.valid){
      this.quantityDays?.setValue(this.datesActions.quantityBetweenDates(this.initialDate.value as string, this.finalDate.value as string));
    }

  }



 }
