import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'card-age',
  templateUrl : './card-age.component.html',
  styleUrls: ['./card-age.component.css',],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAgeComponent {


  @Input() ageFormControl! : FormControl;


  // quantity : number = 0;


  onAdd() {
    const quantity = this.ageFormControl.value;
    this.ageFormControl.setValue(quantity + 1);
  }


  onLess() {
    const quantity = this.ageFormControl.value;

    if(quantity > 0) {
      this.ageFormControl.setValue( quantity - 1 );
    }
  }



}
