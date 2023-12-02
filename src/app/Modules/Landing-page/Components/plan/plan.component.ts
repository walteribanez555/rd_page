import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, TemplateRef } from '@angular/core';
import { ModalService } from '../modal-plan-details/services/modal-service';
import { ServicioUi } from 'src/app/Modules/shared/models';

@Component({
  selector: 'plan',
  templateUrl : './plan.component.html',
  styleUrls: ['./plan.component.css'],
})
export class PlanComponent implements OnInit {

  @Input() servicioUi! : ServicioUi;
  tags : string[] = [];

  constructor(private modalService  : ModalService){

  }
  ngOnInit(): void {
    this.tags = this.servicioUi.disponibilidad.split(',');

  }


  openModal(modalTemplate : TemplateRef<any>){
    this.modalService.open(modalTemplate, this.servicioUi , {size : 'lg' , title : 'AMERICAN RED'}).subscribe(
      (action : any) => {
        console.log('modalAction', action);
      }
    )
  }

  changeState(){
    this.servicioUi.isSelected= !this.servicioUi.isSelected;
  }


}
