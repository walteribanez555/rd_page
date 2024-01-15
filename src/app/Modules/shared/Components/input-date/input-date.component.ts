import {  Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { DatesAction } from '../../utils/dates/dates-action';

@Component({
  selector: 'input-date',

  template: `<input
    type="text"
    [(ngModel)]="date"
    (keyup)="onDeleteWrite($event)"
    placeholder="dd-mm-yyyy"
    autocomplete="false"
  />`,
  styleUrls: ['./input-date.component.css'],
})
export class InputDateComponent {
  date: string  = "";


  @Input() dateControl?: FormControl;
  @Input() ageControl?: FormControl;
  @Input() travelDate? : string;

  @Output() onSetValidDate = new EventEmitter();


  datesAction = new DatesAction();

  onDeleteWrite(event: any) {
    if (event.key === 'Backspace') {
      // Aquí puedes notificar al usuario que se eliminó un carácter
      return;
      // Puedes mostrar una notificación, mensaje, o realizar otra acción
    }
    if (this.date?.length === 2 || this.date?.length === 5) {
      this.date += '-';
    }

    // console.log(this.date?.split('-'));
    if (this.date.length === 10) {
      const arrayToMap = this.date!.split('-');
      this.arraymove(arrayToMap, 0, 1);

      this.ageControl?.setValue(
        this.datesAction.yearsBetweenDates(
          arrayToMap.join('-'),
          this.travelDate!
        )
      );

      this.onSetValidDate.emit(this.date);
      this.dateControl?.setValue(this.date);
    }
  }

  arraymove(arr: string[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}

