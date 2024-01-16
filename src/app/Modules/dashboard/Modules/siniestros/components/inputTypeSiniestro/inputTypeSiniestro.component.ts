import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoSiniestro } from '../../models/TipoSiniestro.ui.model';

@Component({
  selector: 'input-type-siniestro',
  templateUrl: './inputTypeSiniestro.component.html',
  styleUrls: ['./inputTypeSiniestro.component.css'],
})
export class InputTypeSiniestroComponent {
  @Input() tipoSiniestros!: TipoSiniestro[];
  @Output() onChangeActualItem = new EventEmitter();

  @Input() size : string = 'w-50';
  @Input() disable : boolean  = false;

  @Input() isCreating = true;

  onChangeActionChild(position: number) {
    this.tipoSiniestros.forEach((tipoSiniestro, index) => {
      if (index != position) {
        tipoSiniestro.isSelected = false;
      }

      if(this.tipoSiniestros[position].catalogo.valor==2  && tipoSiniestro.catalogo.valor ==4 ){
        tipoSiniestro.isSelected = this.tipoSiniestros[position].isSelected;
      }

    });

    this.onChangeActualItem.emit(position);
  }

  hasSecondCat( pos : number ) {

  }

  isSecondCat( pos : number){

  }
}
