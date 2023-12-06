import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicioUi } from 'src/app/Modules/shared/models';

@Component({
  selector: 'planes',
  templateUrl : './planes.component.html',
  styleUrls: ['./planes.component.css'],
})
export class PlanesComponent  implements OnInit {
  ngOnInit(): void {
    this.observerSelection?.subscribe({
      next: ( serviciosFiltered ) => {
        this.serviciosUiFiltered = serviciosFiltered;
      },
      error : (err) => {
        console.log(err);
      },
      complete : () => {

      }
    })

    this.serviciosUiFiltered = this.serviciosUi;

  }



  @Output() onChangePage = new EventEmitter();
  @Output() onBackStep = new EventEmitter();


  @Input() serviciosUi : ServicioUi[] | null = null;
  serviciosUiFiltered : ServicioUi[] | null = null;

  @Input() observerSelection?  : Observable<ServicioUi[]>;

  onChangeStep() {
    this.onChangePage.emit();
  }

  onBackStepBtn() {
    this.onBackStep.emit();
  }
}
